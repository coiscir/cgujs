class Time
  def serial
    strftime("%Y").to_f - 2000 + strftime("0.%m%d").to_f
  end
end

module Builder
  ROOT = File.expand_path(File.dirname(__FILE__))
  JSMIN = File.join(ROOT, 'jsmin.rb')
  EXTS = {}
  
  module Utilities
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
  
  def Builder.clear(remove)
    File.delete(remove) if File.exists?(remove)
  end
  
  def Builder.start(srcdir, anchor, create)
    Dir.chdir(srcdir) do
      File.open(create, 'w+') do |output|
        output << Builder::Reader.new(anchor, true)
      end
    end
    File.exists?(create)
  end
end
