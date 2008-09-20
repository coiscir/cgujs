################################################################################
# Prepare
####
CRYPTO_ROOT = File.expand_path(File.dirname(__FILE__))
CRYPTO_LIB  = File.join(CRYPTO_ROOT, 'lib')
CRYPTO_SRC  = File.join(CRYPTO_ROOT, 'src')

CRYPTO_START = 'anchor.js'
CRYPTO_FINAL = File.join(CRYPTO_LIB, "#{File.split(CRYPTO_ROOT)[1]}.js")

CRYPTO_EXT_TYPE = File.join(CRYPTO_SRC, 'ext.type.js')

################################################################################
# Tasks
####
task :default do; print "  crypto" + $/; end
task :build => :crypto
task :clean => :clean_crypto

task :clean_crypto do
  if Builder.clear(CRYPTO_FINAL)
    print " -  " + outPath(CRYPTO_FINAL) + $/
  end
  if Builder.clear(CRYPTO_EXT_TYPE)
    print " -  " + outPath(CRYPTO_EXT_TYPE) + $/
  end
end

desc "Build Crypto library script"
task :crypto => [:clean_crypto]
task :crypto do
  if Builder.start(TYPE_SRC, TYPE_START, CRYPTO_EXT_TYPE)
    print " >  " + outPath(CRYPTO_EXT_TYPE) + $/
  end
  if Builder.start(CRYPTO_SRC, CRYPTO_START, CRYPTO_FINAL)
    print " +  " + outPath(CRYPTO_FINAL) + $/
  end
end
