require 'rake'
require 'maruku'

require 'build/builder'
require 'build/crypto'
require 'build/incs'
require 'build/pages'

################################################################################
# Prepare
####
ROOT = File.expand_path(File.dirname(__FILE__))
DOCS = File.join(ROOT, 'md')

DPUB = File.join(DOCS, 'pub')
DSRC = File.join(DOCS, 'src')

FINAL = File.join(ROOT, 'lib', 'cgu.js')
START = File.join(ROOT, 'src', 'cgu.js')

################################################################################
# Versions
####
TIME = Time.now.utc

def version
  # functions until 2100-01-01
  sprintf("%.04f", TIME.strftime('%y.%m%d').to_f)
end

################################################################################
# Tasks
####
task :default => :build

desc "Display Rake Task Infomation"
task :help do
  print $/ + '== Help' + $/
  print [
    "Tasks:",
    "  build  (b)",
    "  remove (r, rm)",
    "  status (s, st)",
    "  help   (h)"
  ].join($/) + $/
end

# short
task :b  => :build
task :r  => :remove
task :rm => :remove
task :s  => :status
task :st => :status
task :h  => :help

# full
desc "Build CGU library script and document pages"
task :build => [:lib, :docs]

desc "Delete CGU library script and document pages"
task :remove => [:rlib, :rdocs]

desc "Check build status of CGU library script and document pages"
task :status => [:slib, :sdocs]

# library script
task :lib do
  print $/ + '== Build' + ' :: Library :: ' + version.to_s + ' (' + TIME.strftime('%Y-%m-%d %H:%M:%S') + ')' + $/
  File.open(FINAL, 'w+') do |lib|
    lib << Builder.build(START)
  end
  print ' + ' + File.basename(FINAL) + $/ if File.exists?(FINAL)
end

task :rlib do
  print $/ + '== Remove' + $/
  print ' - ' + File.basename(FINAL) + $/ if File.exists?(FINAL) && File.delete(FINAL) > 0
end

task :slib do
  print $/ + '== Status' + $/
  print ' ' + (File.exists?(FINAL) ? '+' : '-') + ' ' + File.basename(FINAL) + $/
end

# document pages
task :docs do
end

task :rdocs do
end

task :sdocs do
end