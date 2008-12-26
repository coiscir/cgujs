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
      
      def header(file)
        seg = file.split(/\./)
        head = ""
        head += '# ' + seg[0] + ' # {: #'+@ind+'-Main}' + $/ + $/
        head += '## ' + seg[1] + ' ## {: #'+@ind+'-Util}' + $/ + $/ if !seg[1].nil?
        head += '### ' + seg[2].gsub(/_/, '\\_') + ' ### {: #'+@ind+'-Func}' + $/ + $/ if !seg[2].nil?
        head += '> '
      end
      
      def addpage(file)
        Dir.chdir(@src) do
          link = setlink(file)
          src  = File.exists?(file) ? IO.readlines(file).to_s : nil
          desc = src.nil? ? '' : src.split($/)[0] || ''
          PAGES[file] = {
            'desc' => desc,
            'link' => link,
            'src'  => header(file) + (src || '')
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
          !(r =~ /^\w+(?:\.\w+){0,2}$/i)
        }.each {|f|
          addpage(f)
        }
      end
      
      def navitem(name, items)
        nav  = '<div class="navlist">' + $/
        nav += '  <h3>' + name + '</h3>' + $/
        nav += '  <ul>' + $/
        
        items.each {|i|
          nav += '    <li><a href="' + getlink(i[0]) + '">' + i[1] + '</a></li>' + $/
        }
        
        nav += '  </ul>' + $/
        nav += '</div>'
      end
      
      def navbar(file)
        seg = file.split(/\./)
        nav = []
        
        nav.push(navitem(@name, [
          [@ind, 'API Home'],
          ['Functions', 'Functions']
        ]))
        
        if (!seg[1].nil?)
          funcs = []
          UTILS[seg[1]]['funcs'].each {|f|
            funcs.push([FUNCS[f]['file'], f])
          }
          nav.push(navitem(seg[1], funcs))
        end
        
        utils = []
        UTILS.keys.sort.each {|u|
          utils.push([UTILS[u]['file'], u])
        }
        nav.push(navitem('Utilities', utils))
        
        if (seg[1].nil?)
          funcs = []
          FUNCS.keys.sort.each {|f|
            funcs.push([FUNCS[f]['file'], f])
          }
          nav.push(navitem('Functions', funcs))
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
          
          fp = func.gsub(/_/, '\\_')
          fi = func.gsub(/_/, '-')
          
          md  = '#### [' + fp + '](' + getlink(file) + ') #### {: #func-' + fi + '}' + $/ + $/
          md += '> ' + desc
          
          #html  = '<h4><a href="' + getlink(file) + '">' + func + '</a></h4>' + $/
          #html += '<blockquote>' + $/
          #html += '  ' + Maruku.new(desc).to_html.strip + $/
          #html += '</blockquote>'
          
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
            title = seg[0] == 'Functions' ? seg[0] : seg[1]
            title = [@name, title, seg[2]].reject{|i| i.nil?}.join(' - ')
            navlist = navbar(f)
            content = ERB.new(PAGES[f]['src']).result(binding)
            content = Maruku.new(content).to_html
            
            #content += $/ + $/ + funclist(f) + $/ + $/ + '<hr />' if seg[2].nil? && f != @ind
            
            File.open(File.join(@dst, getlink(f)), 'w+') do |dst|
              dst << ERB.new(temp).result(binding)
            end
          }
        end
      end
    
    public
      
      def getlink(name)
        PAGES[name]['link']
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
          }
        end
      end
      
      def status(dst, src, index)
        @dst = File.expand_path(dst)
        @src = File.expand_path(src)
        @ind = index
        
        if (ready?)
          Dir.chdir(@dst) do
            globbed.each {|f|
              if (f =~ /^\w+(?:\.\w+){0,2}$/i)
                link = setlink(f)
                puts ' ' + (File.exists?(link) ? '+' : '-') + ' ' + f.gsub(/\./, ' - ')
              else
                puts " ? " + f
              end
            }
          end
        else
          puts " ! Status Unknown" + $/
        end
      end
    
  end
  
end
