FROM ruby:2.6.6
LABEL author="david@codegram.com"

ARG DEBIAN_FRONTEND=noninteractive

# Environment variables
ENV SECRET_KEY_BASE 1234
ENV RAILS_ENV production
ENV PYENV_ROOT /root/.pyenv
ENV PATH $PYENV_ROOT/shims:$PYENV_ROOT/bin:$PATH
ENV PYTHON_VERSION=3.8.2
ENV PYTHON_CONFIGURE_OPTS='--enable-shared'

# Install system dependencies
RUN apt-get update && \
  apt-get install -y postgresql postgresql-client postgresql-contrib libpq-dev \
  redis-server memcached imagemagick ffmpeg mupdf mupdf-tools libxml2-dev \
  vim git curl

# Install node
RUN curl -fsSL https://deb.nodesource.com/setup_15.x | bash - && apt-get install -y nodejs

# Create the source folder
RUN mkdir -p /code/tmp

# Add local npm dependencies
ADD voting-scheme-dummy /code/voting-scheme-dummy
ADD voting-scheme-election_guard /code/voting-scheme-election_guard

# Install npm dependencies
ADD decidim-bulletin_board-app/package-lock.json /code/tmp/package.json
ADD decidim-bulletin_board-app/package.json /code/tmp/package.json
RUN cd /code/tmp && npm i

# Add local ruby dependencies
ADD decidim-bulletin_board-ruby /code/decidim-bulletin_board-ruby

# Install ruby dependencies
RUN gem install bundler
ADD decidim-bulletin_board-app/Gemfile /code/tmp/Gemfile
ADD decidim-bulletin_board-app/Gemfile.lock /code/tmp/Gemfile.lock
RUN cd /code/tmp && bundle install

# Install python dependencies
RUN git clone https://github.com/pyenv/pyenv.git ~/.pyenv
RUN pyenv install $PYTHON_VERSION && pyenv global $PYTHON_VERSION
ADD decidim-bulletin_board-app/install_eg_wrappers_no_sudo.sh /code/tmp/install_eg_wrappers_no_sudo.sh
RUN cd /code/tmp && ./install_eg_wrappers_no_sudo.sh

# Add application source code
ADD decidim-bulletin_board-app /code/decidim-bulletin_board-app
RUN cp -r /code/tmp/node_modules /code/decidim-bulletin_board-app
WORKDIR /code/decidim-bulletin_board-app

# Precompile assets
RUN npm install --global yarn
RUN bundle exec rake assets:precompile

# Run rails server
CMD ["bin/rails", "server"]