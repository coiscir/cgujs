require 'rake'

################################################################################
# Prepare
####
ROOT = File.expand_path(File.dirname(__FILE__))
LIBS = File.join(ROOT, 'lib')
SRCS = File.join(ROOT, 'src')

INCS = {
  'type'   => File.join(SRCS, 'type', 'anchor.js'),
  'crypto' => File.join(SRCS, 'crypto', 'anchor.js'),
  'cookie' => File.join(SRCS, 'cookie', 'anchor.js'),
  'query'  => File.join(SRCS, 'query', 'anchor.js'),
  'json'   => File.join(SRCS, 'json', 'anchor.js')
};
DIRS = INCS.keys.sort

require File.join(ROOT, 'builder')

################################################################################
# Versioning
####
TIME = Time.now.utc
VERS = File.join(ROOT, 'VERSION')
PREC = ['prec1', 'prec2', 'prec3', 'prec4', 'prec5']
$prec = nil # default = 2
$vers = nil

def setprecision(prec)
  $prec = prec
end

def setserial(vers)
  $vers = vers
end

def serial
  if ($vers.nil?)
    p = ($prec.is_a?(Numeric) && $prec > 0) ? $prec : 2
    f = "%.#{p*2}f"
    s = "0.%m#{'%d'if(p>1)}#{'%H'if(p>2)}#{'%M'if(p>3)}#{'%S'if(p>4)}"
    setserial(sprintf(f, (TIME.strftime("%Y").to_f - 2000 + TIME.strftime(s).to_f)))
  end
  $vers
end

################################################################################
# Setup
####
INCS.each_pair do |name,anch|
  Builder.register(name, anch)
end

################################################################################
# Tasks
####
task :default do
  print [
    "Tasks:",
    "  build (all)",
    "  clean (rm)",
    "  status (st)",
    "",
    "Version Precision Tasks: (can only use 1)",
    "  prec1 - Y.MM",
    "  prec2 - Y.MMDD - default",
    "  prec3 - Y.MMDDhh",
    "  prec4 - Y.MMDDhhmm",
    "  prec5 - Y.MMDDhhmmss",
  ].join($/) + $/
end

task :prec1 do
  setprecision(1)
  PREC.reject{|p| p=='prec1'}.each{|p| Rake::Task[p].disable}
end
task :prec2 do
  setprecision(2)
  PREC.reject{|p| p=='prec2'}.each{|p| Rake::Task[p].disable}
end
task :prec3 do
  setprecision(3)
  PREC.reject{|p| p=='prec3'}.each{|p| Rake::Task[p].disable}
end
task :prec4 do
  setprecision(4)
  PREC.reject{|p| p=='prec4'}.each{|p| Rake::Task[p].disable}
end
task :prec5 do
  setprecision(5)
  PREC.reject{|p| p=='prec5'}.each{|p| Rake::Task[p].disable}
end

task :all => :build
task :rm  => :clean
task :st  => :status

desc "Build all library scripts"
task :build do
  print $/ + '== Build' + ' :: ' + TIME.strftime('%Y-%m-%d %I:%M:%S') + ' :: ' + serial.to_s + $/
  DIRS.each do |pkg|
    libf = File.join(LIBS, "#{pkg}.js")
    File.open(libf, "w+") do |lib|
      lib << Builder.start(pkg, nil)
      print ' + ' + File.split(libf)[1] + $/ if File.exists?(libf)
    end
  end
end

desc "Delete all library scripts"
task :clean do
  print $/ + '== Clean' + $/
  DIRS.each do |pkg|
    libf = File.join(LIBS, "#{pkg}.js")
    print ' - ' + File.split(libf)[1] + $/ if File.exists?(libf) && File.delete(libf) > 0
  end
end

desc "Check build status of library scrips"
task :status do
  print $/ + '== Status' + $/
  DIRS.each do |pkg|
    libf = File.join(LIBS, "#{pkg}.js")
    print ' ' + (File.exists?(libf) ? '+' : '-') + ' ' + File.split(libf)[1] + $/
  end
end

################################################################################
# Monkey Patch
####
module Rake
  class Task
    def disable
      @already_invoked = true
    end
    
    def enable
      @already_invoked = false
    end
  end
end
