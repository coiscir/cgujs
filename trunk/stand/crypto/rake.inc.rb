################################################################################
# Prepare
####
CRYPTO_ROOT = File.expand_path(File.dirname(__FILE__))
CRYPTO_LIB  = File.join(CRYPTO_ROOT, 'lib')
CRYPTO_SRC  = File.join(CRYPTO_ROOT, 'src')

CRYPTO_START = File.join(CRYPTO_SRC, 'anchor.js')
CRYPTO_FINAL = File.join(CRYPTO_LIB, 'crypto.js')

Builder.define('crypto', CRYPTO_START)
CRYPTO_INCS = {
  'type' => File.join(CRYPTO_SRC, "inc.type.js")
}

################################################################################
# Tasks
####
task :default do; print "  crypto" + $/; end
task :build => :crypto
task :clean => :clean_crypto

task :clean_crypto do
  Builder.clear(CRYPTO_FINAL, true)
  CRYPTO_INCS.each_pair do |inc, loc|
    Builder.clear(loc, true)
  end
end

desc "Build Crypto library script"
task :crypto => [:clean_crypto]
task :crypto do
  CRYPTO_INCS.each_pair do |inc, loc|
    Builder.build(inc, loc, true)
  end
  Builder.build('crypto', CRYPTO_FINAL, true)
end
