require 'erb'
require 'jsmin' # RubyGems

################################################################################
### Builder
### ERB Wrapper for Library Scripts
################################################################################
# Requires: jsmin (http://rubyforge.org/projects/riposte/)
#   $ gem install jsmin
#
# More info at http://www.crockford.com/javascript/jsmin.html
################################################################################
# Syntax
#
#   Builder.build(file)
#
#     `file` (String): Anchor file
#
#   inc([padding,] [minify,] file [, ..] [, sort])
#
#     `padding` (Numeric):   Precedes each line with spaces. Default is 0.
#     `minify` (true/false): Minifies the included source. Default is false.
#     `file` (String):       File name. Path is relative to the file including.
#     `..` (Strings):        Further files to include.
#     `sort` (true/false):   Sort the file names using Array#sort.
################################################################################

module Builder
  module Reader
    def inc(*files)
      ### grab leading options
      # pad = leading spaces
      # min = minify using jsmin
      pad = files.first.is_a?(Numeric) ? files.shift : 0
      min = files.first == !!files.first ? files.shift : false
      srt = files.last == !!files.last ? files.pop : false
      
      ### glob, read, parse and alter files
      # reject = verify file stats
      # map    = read and ERB parse files
      # map    = minify, removing extra newlines and lead spaces
      # map    = add padding, remove trailing
      Dir.glob(files.flatten).sort{|a,b|
        srt ? a <=> b : 0
      }.reject{|file|
        !(File.file?(file) && File.readable?(file))
      }.map{|file|
        Dir.chdir(File.dirname(file)) do
          ERB.new(IO.readlines(File.basename(file)).to_s, nil, '<>').result(binding)
        end
      }.map{|src|
        min ? JSMin.minify(src).gsub(/ ?\n ?/, ' ').sub(/^ +/, '') : src
      }.map{|src|
        src.gsub(/^/, (' ' * pad))
      }.join($/)
    end
    
    def opt(t, f)
      @stand ? t : f
    end
  end
  
  class << self
    include Reader
    
    def build(file, stand)
      @stand = stand === !!stand ? stand : false
      inc(0, false, file).gsub(/[ \t]+$/m, '').gsub(/\r\n|\r|\n/, "\n")
    end
  end
end
