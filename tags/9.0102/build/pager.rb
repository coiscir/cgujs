require 'erb'
require 'maruku' # RubyGems

################################################################################
### Pager
### ERB Wrapper for Document Pages
################################################################################
# Requires: maruku (http://rubyforge.org/projects/maruku/)
#   $ gem install maruku
#
# More info at http://daringfireball.net/projects/markdown/
################################################################################

module Pager
  FUNCS = {}
  UTILS = {}

  PAGES = {}
  
  class << self
    
    private
      
      def ready?
        File.directory?(@dst) && File.writable?(@dst) &&
        File.directory?(@src) && File.readable?(@src) &&
        @ind =~ /^\w+$/ && !(@ind =~ /^functions$/i) &&
        File.file?(File.join(@src, @ind)) && File.readable?(File.join(@src, @ind))
      end
      
      def globbed
        Dir.chdir(@src) do
          Dir.glob("{#{@ind},#{@ind}.*,Functions}").sort
        end
      end
      
      def setlink(file)
        seg = file.split(/\./)
        if (!seg[2].nil?)
          "functions.#{seg[2]}.html"
        elsif (!seg[1].nil?)
          "utilities.#{seg[1]}.html"
        elsif (seg[0] == @ind)
          "index.html"
        else
          "#{seg[0].downcase}.html"
        end
      end
      
      def subname(name)
        name.gsub(/_/, '\\_')
      end
      
      def header(file)
        seg = file.split(/\./)
        use = !seg[2].nil? ? seg[2] : !seg[1].nil? ? seg[1] : seg[0]
        '# ' + subname(use) + ' # {: #'+@ind+'-Main}' + $/+$/ + '> '
      end
      
      def addpage(file)
        Dir.chdir(@src) do
          link = setlink(file)
          src  = File.exists?(file) ? IO.readlines(file).to_s : nil
          desc = src.nil? ? '' : src.split($/)[0] || ''
          PAGES[file] = {
            'desc' => desc,
            'link' => link,
            'src'  => header(file).to_s + (src || '')
          }
        end
        
        addutil(file)
      end
      
      def addutil(file)
        seg = file.split(/\./)
        if (!seg[1].nil?)
          if (UTILS[seg[1]].nil?)
            UTILS[seg[1]] = {
              'file' => seg[0] + '.' + seg[1],
              'funcs' => []
            }
          end
          if (!seg[2].nil?)
            UTILS[seg[1]]['funcs'] = UTILS[seg[1]]['funcs'].push(seg[2]).uniq.sort
          end
        end
        
        addfunc(file)
      end
      
      def addfunc(file)
        seg = file.split(/\./)
        if (!seg[2].nil?)
          FUNCS[seg[2]] = {
            'file' => file,
            'util' => seg[1]
          }
        end
      end
      
      def import
        globbed.reject {|r|
          !(r =~ /^\w+(?:\.\w+){0,2}(?:\.md)?$/i)
        }.each {|f|
          addpage(f)
        }
      end
      
      def navitem(file, name, items)
        nav  = '<div class="navlist">' + $/
        nav += '  <h3>' + name + '</h3>' + $/
        nav += '  <ul>' + $/
        
        items.each {|i|
          nav += '    '
          nav += '<li' + (i[0] == file ? ' class="active"' : '') + '>'
          nav += '<a href="' + getlink(i[0]) + '">' + i[1] + '</a>'
          nav += '</li>' + $/
        }
        
        nav += '  </ul>' + $/
        nav += '</div>'
      end
      
      def navbar(file)
        seg = file.split(/\./)
        nav = []
        
        nav.push(navitem(file, @name, [
          [@ind, 'API Home'],
          ['Functions', 'Functions']
        ]))
        
        if (!seg[1].nil?)
          funcs = []
          UTILS[seg[1]]['funcs'].each {|f|
            funcs.push([FUNCS[f]['file'], f])
          }
          nav.push(navitem(file, seg[1], funcs))
        end
        
        utils = []
        UTILS.keys.sort.each {|u|
          utils.push([UTILS[u]['file'], u])
        }
        nav.push(navitem(file, 'Utilities', utils))
        
        if (seg[1].nil?)
          funcs = []
          FUNCS.keys.sort.each {|f|
            funcs.push([FUNCS[f]['file'], f])
          }
          nav.push(navitem(file, 'Functions', funcs))
        end
        
        nav.join($/ + $/).gsub(/^/, (' ' * 6)).gsub(/[ \t]+$/m, '')
      end
      
      def funclist(file)
        seg = file.split(/\./)
        funcs = seg[1].nil? ? FUNCS.keys : UTILS[seg[1]]['funcs']
        list = []
        
        funcs.sort.each {|func|
          file = FUNCS[func]['file']
          desc = PAGES[file]['desc'].strip
          
          fp = func.gsub(/_/, '\\_') # function print
          fi = func.gsub(/_/, '-')   # function id
          
          md  = '#### [' + fp + '](' + getlink(file) + ') #### {: #func-' + fi + '}' + $/ + $/
          md += '> ' + desc
          
          list.push(md)
        }
        
        list.join($/ + $/).gsub(/[ \t]+$/m, '')
      end
      
      def export
        Dir.chdir(@dst) do
          temp = IO.readlines(@temp).to_s
          
          globbed.reject {|r|
            !(r =~ /^\w+(?:\.\w+){0,2}$/i)
          }.each {|f|
            seg = f.split(/\./)
            
            funcs = funclist(f)
            title = [
              (@name.strip + ' API ' + version),
              (seg[0] == 'Functions' ? seg[0] : seg[1]),
              (seg[2])
            ].reject{|i| i.nil?}.join(' - ')
            navlist = navbar(f)
            content = ERB.new(PAGES[f]['src']).result(binding)
            content = Maruku.new(content).to_html
            
            content = content.gsub(/<code>.*?<\/code>/m) {|c|
              c.gsub(/\r?\n/, '<br />').gsub(/  /, ' &nbsp;')
            }
            
            File.open(File.join(@dst, getlink(f)), 'w+') do |dst|
              dst << ERB.new(temp).result(binding)
            end
            
            status(@dst, @src, @ind, f)
          }
        end
      end
    
    public
      
      def getlink(name)
        PAGES[name].nil? ? nil : PAGES[name]['link']
      end
      
      def page(name, dst, src, index, temp)
        @name = name
        @dst  = File.expand_path(dst)
        @src  = File.expand_path(src)
        @ind  = index
        @temp = File.join(@src, temp)
        
        return nil unless ready?
        
        import
        export
      end
      
      def remove(dst, src, index)
        @dst = File.expand_path(dst)
        @src = File.expand_path(src)
        @ind = index
        
        Dir.chdir(@dst) do
          globbed.each {|f|
            link = setlink(f)
            File.delete(link) if File.exists?(link)
            
            status(@dst, @src, @ind, f)
          }
        end
      end
      
      def status(dst, src, index, file)
        @dst = File.expand_path(dst)
        @src = File.expand_path(src)
        @ind = index
        
        if (ready?)
          Dir.chdir(@dst) do
            (file.nil? ? globbed : [file]).each {|f|
              if (f =~ /^\w+(?:\.\w+){0,2}$/i)
                link = setlink(f)
                puts ' ' + (File.exists?(link) ? '+' : '-') + ' ' + f + $/
              else
                puts " ? " + f + $/
              end
            }
          end
        else
          puts " ! Status Unknown" + $/
        end
      end
    
  end
  
end
