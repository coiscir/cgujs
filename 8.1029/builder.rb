################################################################################
### Builder
### ERB Wrapper
################################################################################
# Requires: jsmin (http://rubyforge.org/projects/riposte/)
#   $ gem install jsmin
#
# More info at http://www.crockford.com/javascript/jsmin.html
################################################################################
# Builder builds projects in 4 stages:
#
#   1. Register
#     Each project is registered with a name and anchor file. The name is used
#     later within the Require stage. The anchor file is simply the starting
#     point for that project. It should specify all initial includes and
#     requires necessary to build the final script.
#     
#   2. Reader/Include
#     Includes are subsequent script files for the project. They are specified
#     using the `inc` function with relative paths to the anchor file.
#
#   3. Cache
#     Project sources are cached as one script with all Includes. Requires are
#     only gather, not used.
#
#   4. Final/Require
#     (As noted above) Requires are other projects needed. They are specified
#     using the `req` function by passing the project name (from Register).
#     With `req` functions unused during Cache, they can now be checked
#     against all projects already required to prevent duplicates.
################################################################################
# Syntax
#
#   include([padding,] [jsmin,] file, ..)
#   require([padding,] project, ..)
#
#   `padding` (Numeric): Precedes each included line with number of spaces.
#   `jsmin` (true/false): Minifies the included source.
#
#   Note: Requires are always minified.
################################################################################
# Example: Source (src/foo/anchor.js)
#
#   var Foo = new (function () {
#
#   <%# include 'base.js' with jsmin minifying %>
#   <%= include true, 'base.js' %>
#
#   <%# include 'core.js' and 'keys.js' with left-padding of 2 spaces %>
#   <%= include 2, 'core.js', 'keys.js' %>
#
#   <%# include 'utils.js' with jsmin and 2 padding %>
#   <%= include 2, true 'utils.js' %>
#
#   // require: Bar
#   <%= require 2, 'bar' %>
#
#   })();
################################################################################
# Example: Ruby/Rake
#
#   Builder.register('foo', File.join('src', 'foo', 'anchor.js'))
#   Builder.register('bar', File.join('src', 'bar', 'anchor.js'))
#   
#   File.open(File.join('dist', 'foo.js'), 'w+') do |foo|
#     foo << Builder.start('foo')
#   end
################################################################################

require 'jsmin'
require 'erb'

module Builder
  
  PKGS = {}
  
  class Reader
    def initialize(name, pkgs)
      return if !Builder.registered?(name)
      @pkgs = pkgs.uniq.sort
      @step = @pkgs.dup
      
      if (PKGS[name]['src'].nil?)
        start = File.split(PKGS[name]['start'])
        Dir.chdir(start[0]) do
          @src = PKGS[name]['src'] = reader(start[1])
        end
      else
        @src = PKGS[name]['src']
      end
      
      self
    end
    
    def inc(*files)
      pad = files.first.is_a?(Numeric) ? files.shift : 0
      min = files.first == true ? files.shift : false
      files.reject{
        |f| !File.file?(f)
      }.map{
        |f| reader(f).strip
      }.map{
        |f| min ? JSMin.minify(f).gsub(/\n/, '').sub(/^ /, '') : f
      }.map{
        |f| f.gsub(/^/, (' ' * pad))
      }.join($/+(min ? '' : $/))
    end
    
    def req(*pkgs)
      if (@save_reqs)
        @step = [].concat(@step).concat(pkgs.reject{|p| !Builder.registered?(p)}).uniq.sort
        return "<%= req " + pkgs.map{|p| p.inspect}.join(', ') + " %>"
      end
      
      pad = pkgs.first.is_a?(Numeric) ? pkgs.shift : 0
      min = pkgs.first == true ? pkgs.shift : false
      pkgs.reject{
        |p| !Builder.registered?(p) || @pkgs.include?(p)
      }.map{
        |p| Builder.start(p, @step)
      }.map{
        |p| min ? JSMin.minify(p).gsub(/\n/, '').sub(/^ +/, '') : p
      }.map{
        |p| p.gsub(/^/, (' ' * pad))
      }.join($/)
    end
    
    def to_s
      final
    end
    
    private
    
    def parse(source)
      ERB.new(source).result(binding)
    end
    
    def reader(file)
      @save_reqs = true
      parse(IO.readlines(file).to_s)
    end
    
    def final
      @save_reqs = false
      parse(@src).gsub(/[ \t]+$/m, '')
    end
  end

  class << self
    def registered?(name)
      PKGS.keys.include?(name)
    end
    
    def register(name, anchor)
      return if !PKGS[name].nil?
      return if !File.file?(anchor)
      
      PKGS[name] = {'start' => File.expand_path(anchor)}
    end
    
    def start(name, pkgs)
      return if !self.registered?(name)
      
      pkgs = [] if pkgs.nil?
      Reader.new(name, [name].concat(pkgs).uniq).to_s
    end
  end
  
end
