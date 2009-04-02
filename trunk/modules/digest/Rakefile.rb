Dir.chdir(File.expand_path(File.dirname(__FILE__)))

require 'rake'
require 'build/builder'

################################################################################
# Prepare
####
LIB = File.join('lib', 'cgu.crypto.js')
MIN = File.join('lib', 'cgu.crypto.min.js')
SRC = File.join('src', 'cgu.crypto.js')

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
task :build => [:lib]

desc "Delete CGU library script and document pages"
task :remove => [:rlib]

desc "Check build status of CGU library script and document pages"
task :status => [:slib]

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
