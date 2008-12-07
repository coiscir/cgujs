require 'rake'

################################################################################
# Prepare
####
ROOT = File.expand_path(File.dirname(__FILE__))

FINAL = File.join(ROOT, 'lib', 'cgu.js')
START = File.join(ROOT, 'src', 'cgu.js')

INCS = [
  'type.js',
  'crypto.js',
  'query.js',
  'cookie.js',
  'time.js',
  'json.js'
].sort

Dir.chdir(ROOT) do
  require 'builder'
end

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

task :b  => :build
task :r  => :remove
task :rm => :remove
task :s  => :status
task :st => :status
task :h  => :help

desc "Build CGU Library Script"
task :build do
  print $/ + '== Build' + ' :: ' + TIME.strftime('%Y-%m-%d %H:%M:%S') + ' :: ' + version.to_s + $/
  File.open(FINAL, 'w+') do |lib|
    lib << Builder.build(START)
  end
  print ' + ' + File.basename(FINAL) + $/ if File.exists?(FINAL)
end

desc "Delete CGU Library Script"
task :remove do
  print $/ + '== Remove' + $/
  print ' - ' + File.basename(FINAL) + $/ if File.exists?(FINAL) && File.delete(FINAL) > 0
end

desc "Check build status"
task :status do
  print $/ + '== Status' + $/
  print ' ' + (File.exists?(FINAL) ? '+' : '-') + ' ' + File.basename(FINAL) + $/
end
