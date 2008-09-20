################################################################################
# Prepare
####
QUERY_ROOT = File.expand_path(File.dirname(__FILE__))
QUERY_LIB  = File.join(QUERY_ROOT, 'lib')
QUERY_SRC  = File.join(QUERY_ROOT, 'src')

QUERY_START = 'anchor.js'
QUERY_FINAL = File.join(QUERY_LIB, "#{File.split(QUERY_ROOT)[1]}.js")

QUERY_EXT_TYPE = File.join(QUERY_SRC, 'ext.type.js')

################################################################################
# Tasks
####
task :default do; print "  query" + $/; end
task :build => :query
task :clean => :clean_query

task :clean_query do
  if Builder.clear(QUERY_FINAL)
    print " -  " + outPath(QUERY_FINAL) + $/
  end
  if Builder.clear(QUERY_EXT_TYPE)
    print " -  " + outPath(QUERY_EXT_TYPE) + $/
  end
end

desc "Build Query library script"
task :query => [:clean_query]
task :query do
  if Builder.start(TYPE_SRC, TYPE_START, QUERY_EXT_TYPE)
    print " >  " + outPath(QUERY_EXT_TYPE) + $/
  end
  if Builder.start(QUERY_SRC, QUERY_START, QUERY_FINAL)
    print " +  " + outPath(QUERY_FINAL) + $/
  end
end
