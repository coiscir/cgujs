Dir.chdir(File.expand_path(File.dirname(__FILE__)))

require 'rake'
require 'build/builder'

################################################################################
# Prepare
####
INPUT = File.join('src', 'cgu.crypto.js')
STAND = File.join('lib', 'cgu.crypto.js')
SHARE = File.join('lib', 'cgu.crypto.share.js')

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
task :build => [:lib]

desc "Delete CGU library script and document pages"
task :remove => [:rlib]

desc "Check build status of CGU library script and document pages"
task :status => [:slib]

# library script
task :lib do
  print $/ + '== Build :: Library :: ' + version.to_s + ' (' + TIME.strftime('%Y-%m-%d %H:%M:%S') + ')' + $/
  File.open(STAND, 'w+b') do |lib|
    lib << Builder.build(INPUT, true)
  end
  File.open(SHARE, 'w+b') do |lib|
    lib << Builder.build(INPUT, false)
  end
  print ' + ' + File.basename(STAND) + $/ if File.exists?(STAND)
  print ' + ' + File.basename(SHARE) + $/ if File.exists?(SHARE)
end

task :rlib do
  print $/ + '== Remove :: Library' + $/
  print ' - ' + File.basename(STAND) + $/ if File.exists?(STAND) && File.delete(STAND) > 0
  print ' - ' + File.basename(SHARE) + $/ if File.exists?(SHARE) && File.delete(SHARE) > 0
end

task :slib do
  print $/ + '== Status :: Library' + $/
  print ' ' + (File.exists?(STAND) ? '+' : '-') + ' ' + File.basename(STAND) + $/
  print ' ' + (File.exists?(SHARE) ? '+' : '-') + ' ' + File.basename(SHARE) + $/
end
