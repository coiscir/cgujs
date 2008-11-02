<html>
<head>
  <title>Time - Test Cases</title>
</head>
<body>

<script src="../lib/time.js"></script>
<script type="text/javascript">
if (!(window.Time && window.Time.Version)) {

document.writeln("Time doesn't exist. Build with Ruby/Rake.");

} else {

document.write('<pre style="font-size:11px;">');

document.writeln(''.concat(
  '  Day      : ', Time.phpdate('d ~ D ~ j ~ l ~ N ~ S ~ w ~ z        '), '\n',
  '             ', "<?=    date('d ~ D ~ j ~ l ~ N ~ S ~ w ~ z        ')?>", '\n',
  '  Week     : ', Time.phpdate('W                                    '), '\n',
  '             ', "<?=    date('W                                    ')?>", '\n',
  '  Month    : ', Time.phpdate('F ~ m ~ M ~ n ~ t                    '), '\n',
  '             ', "<?=    date('F ~ m ~ M ~ n ~ t                    ')?>", '\n',
  '  Year     : ', Time.phpdate('L ~ o ~ Y ~ y                        '), '\n',
  '             ', "<?=    date('L ~ o ~ Y ~ y                        ')?>", '\n',
  '  Time     : ', Time.phpdate('a ~ A ~ B ~ g ~ G ~ h ~ H ~ i ~ s ~ u'), '\n',
  '             ', "<?=    date('a ~ A ~ B ~ g ~ G ~ h ~ H ~ i ~ s ~ u')?>", '\n',
  '  Timezone : ', Time.phpdate('I ~ O ~ P ~ Z                        '), '\n',
  '             ', "<?=    date('I ~ O ~ P ~ Z                        ')?>", '\n',
  '  Full     : ', Time.phpdate('c ~ r ~ U                            '), '\n',
  '             ', "<?=    date('c ~ r ~ U                            ')?>"
));
document.writeln('');

document.write('</pre>');

}
</script>

</body>
</html>
