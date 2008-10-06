################################################################################
# Prepare
####
TYPE_ROOT = File.expand_path(File.dirname(__FILE__))
TYPE_LIB  = File.join(TYPE_ROOT, 'lib')
TYPE_SRC  = File.join(TYPE_ROOT, 'src')

TYPE_START = File.join(TYPE_SRC, 'anchor.js')
TYPE_FINAL = File.join(TYPE_LIB, 'type.js')

Builder.define('type', TYPE_START)
TYPE_INCS = {}

################################################################################
# Tasks
####
task :default do; print "  type" + $/; end
task :build => :type
task :clean => :clean_type

task :clean_type do
  Builder.clear(TYPE_FINAL, true)
  TYPE_INCS.each_pair do |inc, loc|
    Builder.clear(loc, true)
  end
end

desc "Build Type library script"
task :type => [:clean_type]
task :type do
  TYPE_INCS.each_pair do |ext, loc|
    Builder.build(ext, loc, true)
  end
  Builder.build('type', TYPE_FINAL, true)
end
