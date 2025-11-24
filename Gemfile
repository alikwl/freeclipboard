source "https://rubygems.org"

# We use the github-pages gem to ensure your site looks exactly like it will online
gem "github-pages", group: :jekyll_plugins

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-seo-tag"
  gem "jekyll-sitemap"
  gem "jekyll-minifier"
  gem "jekyll-include-cache"
end

# Windows specific fixes (Updated for Ruby 3.4+)
gem "webrick"
gem "tzinfo", "~> 1.2"
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Using a newer version of wdm that supports Ruby 3.x better
gem "wdm", ">= 0.1.1", :platforms => [:mingw, :mswin, :x64_mingw]

# Required fix for Ruby 3.4.0 error
gem "bigdecimal"
gem "base64"
gem "csv"
gem "mutex_m"