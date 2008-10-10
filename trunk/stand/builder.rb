def outPath(file)
  root = File.expand_path(File.dirname(__FILE__))
  keys = { 'src' => '++', 'lib' => '=>'}
  file.sub(/#{Regexp.quote(root)}\/([^\/]+)\/(?:[^\/]*\/)*?(?:([^\/]+)\/)?([^\/]+)$/) do
    [$1.ljust(LONGDIR), keys[$2], $3].join(' ')
  end
end

module Builder
  ROOT = File.expand_path(File.dirname(__FILE__))
  JSMIN = File.join(ROOT, 'jsmin.rb')
  INCS = {}
  
  module Utilities
    def serial(t)
      s = NODAY === true ? "0.%m" : "0.%m%d";
      f = NODAY === true ? "%.2f" : "%.4f";
      sprintf(f, (t.strftime("%Y").to_f - 2000 + t.strftime(s).to_f))
    end
    
    def jsmin(*filenames)
      filenames.map {|name| File.expand_path(name)}
      filenames.map {|name| (`ruby #{JSMIN} < #{name}`).strip}.join("\n")
    end
    
    def include(*filenames)
      filenames.map {|name| Reader.new(name, nil).to_s.strip}.join("\n\n")
    end
  end
  
  class Reader
    include Utilities
    
    def initialize(filename, anchor)
      @filename = File.expand_path(filename)
      @template = ERB.new(IO.read(@filename), nil, '%')
      @anchor = anchor === true ? true : false
    end
    
    def to_s
      @template.result(binding).gsub(/[ \t]+$/m, '').strip + (@anchor ? $/ : '')
    end
  end
  
  def Builder.define(name, anchor)
    if (INCS[name].nil?)
      INCS[name] = anchor
      return true
    else
      return false
    end
  end
  
  def Builder.clear(remove, display)
    e = File.exists?(remove)
    File.delete(remove) if e
    Builder.check(remove) if (display && e && !File.exists?(remove))
  end
  
  def Builder.build(name, create, display)
    e = File.exists?(create)
    if (INCS[name].nil?)
      return nil
    else
      inc = File.split(INCS[name])
      Dir.chdir(inc[0]) do
        File.open(create, 'w+') do |output|
          output << Builder::Reader.new(inc[1], true)
        end
      end
    end
    Builder.check(create) if (display && !e && File.exists?(create))
  end

  def Builder.check(name)
    print ' ' + (File.exists?(name) ? '+' : '-') + '  ' + outPath(name) + $/
  end
end

