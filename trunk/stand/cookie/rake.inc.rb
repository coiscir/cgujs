################################################################################
# Prepare
####
COOKIE_ROOT = File.expand_path(File.dirname(__FILE__))
COOKIE_LIB  = File.join(COOKIE_ROOT, 'lib')
COOKIE_SRC  = File.join(COOKIE_ROOT, 'src')

COOKIE_START = File.join(COOKIE_SRC, 'anchor.js')
COOKIE_FINAL = File.join(COOKIE_LIB, 'cookie.js')

Builder.define('cookie', COOKIE_START)
COOKIE_INCS = {
  'type' => File.join(COOKIE_SRC, "inc.type.js")
}

################################################################################
# Tasks
####
task :default do; print "  cookie" + $/; end
task :build => :cookie
task :clean => :clean_cookie

task :clean_cookie do
  Builder.clear(COOKIE_FINAL, true)
  COOKIE_INCS.each_pair do |inc, loc|
    Builder.clear(loc, true)
  end
end

desc "Build Cookie library script"
task :cookie => [:clean_cookie]
task :cookie do
  COOKIE_INCS.each_pair do |inc, loc|
    Builder.build(inc, loc, true)
  end
  Builder.build('cookie', COOKIE_FINAL, true)
end
