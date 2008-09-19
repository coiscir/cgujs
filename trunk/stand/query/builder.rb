class Time
  def serial
    strftime("%Y").to_f - 2000 + strftime("0.%m%d").to_f
  end
end

module Builder
  ROOT = File.expand_path(File.dirname(__FILE__))
  JSMIN = File.join(ROOT, 'jsmin.rb')
  
  module Utilities
    def jsmin(*filenames)
      filenames.map {|name| File.expand_path(name)}
      filenames.map {|name| (`ruby #{JSMIN} < #{name}`).strip}.join("\n")
    end
    
    def include(*filenames)
      filenames.map {|name| Reader.new(name).to_s.strip}.join("\n\n")
    end
  end
  
  class Reader
    include Utilities
    
    def initialize(filename)
      @filename = File.expand_path(filename)
      @template = ERB.new(IO.read(@filename), nil, '%')
    end
    
    def to_s
      @template.result(binding).gsub(/[ \t]+$/m, '').strip
    end
  end
  
  class Anchor
    include Utilities
    
    def initialize(filename)
      @read = include(filename)
    end
    
    def to_s
      @read + "\n"
    end
  end
end
