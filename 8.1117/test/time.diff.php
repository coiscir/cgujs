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

document.writeln('  Day      : ', Time.phpdate('d ~ D ~ j ~ l ~ N ~ S ~ w ~ z        '));
document.writeln('             ', "<?=    date('d ~ D ~ j ~ l ~ N ~ S ~ w ~ z        ')?>");
document.writeln('  Week     : ', Time.phpdate('W                                    '));
document.writeln('             ', "<?=    date('W                                    ')?>");
document.writeln('  Month    : ', Time.phpdate('F ~ m ~ M ~ n ~ t                    '));
document.writeln('             ', "<?=    date('F ~ m ~ M ~ n ~ t                    ')?>");
document.writeln('  Year     : ', Time.phpdate('L ~ o ~ Y ~ y                        '));
document.writeln('             ', "<?=    date('L ~ o ~ Y ~ y                        ')?>");
document.writeln('  Time     : ', Time.phpdate('a ~ A ~ B ~ g ~ G ~ h ~ H ~ i ~ s ~ u'));
document.writeln('             ', "<?=    date('a ~ A ~ B ~ g ~ G ~ h ~ H ~ i ~ s ~ u')?>");
document.writeln('  Timezone : ', Time.phpdate('I ~ O ~ P ~ Z                        '));
document.writeln('             ', "<?=    date('I ~ O ~ P ~ Z                        ')?>");
document.writeln('  Full     : ', Time.phpdate('c ~ r ~ U                            '));
document.writeln('             ', "<?=    date('c ~ r ~ U                            ')?>");
document.writeln('');

document.write('</pre>');

}
</script>

</body>
</html>
