################################################################################
# Prepare
####
TYPE_ROOT = File.expand_path(File.dirname(__FILE__))
TYPE_LIB  = File.join(TYPE_ROOT, 'lib')
TYPE_SRC  = File.join(TYPE_ROOT, 'src')

TYPE_START = 'anchor.js'
TYPE_FINAL = File.join(TYPE_LIB, "#{File.split(TYPE_ROOT)[1]}.js")

################################################################################
# Tasks
####
task :default do; print "  type" + $/; end
task :build => :type
task :clean => :clean_type

task :clean_type do
  if Builder.clear(TYPE_FINAL)
    print " -  " + outPath(TYPE_FINAL) + $/
  end
end

desc "Build Type library script"
task :type => [:clean_type]
task :type do
  if Builder.start(TYPE_SRC, TYPE_START, TYPE_FINAL)
    print " +  " + outPath(TYPE_FINAL) + $/
  end
end
