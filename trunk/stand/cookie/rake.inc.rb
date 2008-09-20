################################################################################
# Prepare
####
COOKIE_ROOT = File.expand_path(File.dirname(__FILE__))
COOKIE_LIB  = File.join(COOKIE_ROOT, 'lib')
COOKIE_SRC  = File.join(COOKIE_ROOT, 'src')

COOKIE_START = 'anchor.js'
COOKIE_FINAL = File.join(COOKIE_LIB, "#{File.split(COOKIE_ROOT)[1]}.js")

COOKIE_EXT_TYPE = File.join(COOKIE_SRC, 'ext.type.js')

################################################################################
# Tasks
####
task :default do; print "  cookie" + $/; end
task :build => :cookie
task :clean => :clean_cookie

task :clean_cookie do
  if Builder.clear(COOKIE_FINAL)
    print " -  " + outPath(COOKIE_FINAL) + $/
  end
  if Builder.clear(COOKIE_EXT_TYPE)
    print " -  " + outPath(COOKIE_EXT_TYPE) + $/
  end
end

desc "Build Cookie library script"
task :cookie => [:clean_cookie]
task :cookie do
  if Builder.start(TYPE_SRC, TYPE_START, COOKIE_EXT_TYPE)
    print " >  " + outPath(COOKIE_EXT_TYPE) + $/
  end
  if Builder.start(COOKIE_SRC, COOKIE_START, COOKIE_FINAL)
    print " +  " + outPath(COOKIE_FINAL) + $/
  end
end
