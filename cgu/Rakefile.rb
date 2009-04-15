Dir.chdir(File.expand_path(File.dirname(__FILE__)))

require 'rake'
require 'build/builder'
require 'build/pager'

################################################################################
# Prepare
####
DOCS = File.join('docs')
DSRC = File.join('docs', 'src')

LIB = File.join('lib', 'cgu.js')
MIN = File.join('lib', 'cgu.min.js')
SRC = File.join('src', 'cgu.js')

################################################################################
# Versions
####
TIME = Time.now.utc

def version
  TIME.strftime('%Y.%m%d')
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
  print $/ + '== Build :: Library :: ' + version.to_s + ' (' + TIME.strftime('%Y-%m-%d %H:%M:%S') + ')' + $/
  File.open(LIB, 'w+b') do |lib|
    lib << Builder.build(SRC, false)
  end
  print ' + ' + File.basename(LIB) + $/ if File.exists?(LIB)
  File.open(MIN, 'w+b') do |min|
    min << Builder.build(SRC, true)
  end
  print ' + ' + File.basename(MIN) + $/ if File.exists?(MIN)
end

task :rlib do
  print $/ + '== Remove :: Library' + $/
  print ' - ' + File.basename(LIB) + $/ if File.exists?(LIB) && File.delete(LIB) > 0
  print ' - ' + File.basename(MIN) + $/ if File.exists?(MIN) && File.delete(MIN) > 0
end

task :slib do
  print $/ + '== Status :: Library' + $/
  print ' ' + (File.exists?(LIB) ? '+' : '-') + ' ' + File.basename(LIB) + $/
  print ' ' + (File.exists?(MIN) ? '+' : '-') + ' ' + File.basename(MIN) + $/
end

# document pages
task :docs do
  print $/ + '== Build :: Documents :: ' + version.to_s + ' (' + TIME.strftime('%Y-%m-%d %H:%M:%S') + ')' + $/
  Pager.page('CGU API', version, DOCS, DSRC, 'CGU', 'template.html')
end

task :rdocs do
  print $/ + '== Remove :: Documents' + $/
  Pager.remove(DOCS, DSRC, 'CGU')
end

task :sdocs do
  print $/ + '== Status :: Documents' + $/
  Pager.status(DOCS, DSRC, 'CGU', nil)
end
