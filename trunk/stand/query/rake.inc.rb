################################################################################
# Prepare
####
QUERY_ROOT = File.expand_path(File.dirname(__FILE__))
QUERY_LIB  = File.join(QUERY_ROOT, 'lib')
QUERY_SRC  = File.join(QUERY_ROOT, 'src')

QUERY_START = File.join(QUERY_SRC, 'anchor.js')
QUERY_FINAL = File.join(QUERY_LIB, 'query.js')

Builder.define('query', QUERY_START)
QUERY_INCS = {
  'type' => File.join(QUERY_SRC, "inc.type.js")
}

################################################################################
# Tasks
####
task :default do; print "  query" + $/; end
task :build => :query
task :clean => :clean_query

task :clean_query do
  Builder.clear(QUERY_FINAL, true)
  QUERY_INCS.each_pair do |inc, loc|
    Builder.clear(loc, true)
  end
end

desc "Build Query library script"
task :query => [:clean_query]
task :query do
  QUERY_INCS.each_pair do |inc, loc|
    Builder.build(inc, loc, true)
  end
  Builder.build('query', QUERY_FINAL, true)
end
