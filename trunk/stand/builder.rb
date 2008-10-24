require 'rubygems'
require 'jsmin'
require 'erb'

module Builder
  
  PKGS = {}
  
  class Reader
    def initialize(name, file, pkgs)
      return if !Builder.registered?(name)
      @save_reqs = true
      @pkgs = pkgs.uniq.sort
      
      if (PKGS[name]['src'].nil?)
        start = File.split(file)
        Dir.chdir(start[0]) do
          @src = PKGS[name]['src'] = reader(start[1])
        end
      else
        @src = PKGS[name]['src']
      end
      self
    end
    
    def require(*pkgs)
      return ("<%= require " + pkgs.map{|p| p.inspect}.join(', ') + " %>") if @save_reqs
      
      pad = pkgs.first.is_a?(Numeric) ? pkgs.shift : 0
      step = [].concat(@pkgs).concat(pkgs).uniq.sort
      pkgs.reject{
        |p| !Builder.registered?(p) || @pkgs.include?(p)
      }.map{
        |p| JSMin.minify(Builder.start(p, step)).gsub(/\n/, '').sub(/^ /, '')
      }.map{
        |p| p.gsub(/^/, (' ' * pad))
      }.join($/)
    end
    
    def include(*files)
      pad = files.first.is_a?(Numeric) ? files.shift : 0
      min = files.first == true ? files.shift : false
      files.map{
        |f| reader(f).strip
      }.map{
        |f| min ? JSMin.minify(f).gsub(/\n/, '').sub(/^ /, '') : f
      }.map{
        |f| f.gsub(/^/, (' ' * pad))
      }.join($/+(min ? '' : $/))
    end
    
    def to_s
      final
    end
    
    private
    
    def reader(file)
      parse(IO.readlines(file).to_s)
    end
    
    def parse(source)
      ERB.new(source).result(binding)
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
      Reader.new(name, PKGS[name]['start'], [name].concat(pkgs).uniq).to_s
    end
  end
  
end
