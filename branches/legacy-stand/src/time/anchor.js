<%= req false, 'HEADER' %>

/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time
 *    Date/Time Manipulation
 *~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Properties
 *
 *  Version
 *
 *    Actually a misnomer, Version is the date built. Depending on the build
 *    options used, it can be between 'Y.MM' and 'Y.MMDDHHMISS'.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *~~~ Methods
 *
 *  abs | utc -> Absolute Date creation.
 *
 *    Syntax: Time.abs([yr [, mn [, dy [, hr [, mi [, sc [, ms]]]]]]])
 *
 *      (All parameters are optional. Default is '0000-00-01 00:00:00'.)
 *
 *    Return: <Number>: Epoch timestamp.
 *----
 *  lang -> Get current language in-use.
 *
 *    Syntax: Time.lang()
 *
 *    Return: <String>
 *
 *  langDetect -> Get user, browser, or system language.
 *
 *    Syntax: Time.langDetect()
 *
 *    Return: <String>
 *
 *  langList -> List supported languages.
 *
 *    Syntax: Type.langList()
 *
 *    Return: <Array>
 *
 *  langReset -> Reset in-use language to configured default.
 *
 *    Syntax: Type.langReset()
 *
 *    Return: <Boolean>: Success.
 *
 *  langSet -> Set in-use language.
 *
 *    Syntax: Type.langSet(lang)
 *
 *      lang <String>: Language to use.
 *
 *    Return: <Boolean>: Success.
 *
 *  langSetDetect -> Set in-use language to detected language.
 *
 *    Syntax: Type.langSetDetect()
 *
 *    Return: <Boolean>: Success.
 *
 *----
 *
 *  phpdate | phputc -> PHP date() formatting.
 *
 *    Note: phpdate and phputc are English-only.
 *
 *    Syntax: Time.phpdate(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *        d - Day of the month, 2 digits with leading zeros (01 - 31)
 *        D - A textual representation of a day, three letters (Mon - Sun)
 *        j - Day of the month without leading zeros (1 - 31)
 *        l - A full textual representation of the day of week (Sunday - Saturday)
 *        N - ISO-8601 numeric representation of the day of the week (1 - 7)
 *        S - English ordinal suffix for the day of the month (st, nd, rd, th)
 *        w - Numeric representation of the day of the week (0 - 6)
 *        z - The day of the year (0 - 365)
 *
 *        W - ISO-8601 week number of year, weeks starting on Monday (00 - 53)
 *
 *        F - A full textual representation of a month. (January - December)
 *        m - Numeric representation of a month, with leading zeros. (01 - 12)
 *        M - A short textual representation of a month. (Jan - Dec)
 *        n - Numeric representation of a month, without leading zeros. (1 - 12)
 *        t - Number of days in the given month. (28 - 31)
 *
 *        L - Whether it's a leap year. (0 or 1)
 *        O - ISO-8601 year number.
 *        y - A full numeric representation of a year, 4 digits.
 *        Y - A two digit representation of a year.
 *
 *        a - Lowercase meridiem. (am or pm)
 *        A - Uppercase meridiem. (AM or PM)
 *        B - Swatch Internet Time. (000 - 999)
 *        g - 12-hour without leading zeros. (1 - 12)
 *        G - 24-hour without leading zeros. (0 - 23)
 *        h - 12-hour with leading zeros. (01 - 12)
 *        H - 24-hour with leading zeros. (00 - 23)
 *        i - Minutes with leading zeros. (00 - 59)
 *        s - Seconds with leading zeros. (00 - 59)
 *        u - Microseconds
 *
 *        e - [unsupported] Timezone identifier.
 *        I - Whether daylight savings time. (0 or 1)
 *        O - Difference to Greenwich time. (e.g. +0200)
 *        P - Difference to Greenwich time. (e.g. +02:00)
 *        T - [unsupported] Timezone abbreviation.
 *        Z - Timezone offset is seconds. (-43200 - 50400)
 *
 *        c - ISO-8601 date. (e.g. 2004-02-12T15:19:21+00:00)
 *        r - RFC 2822 date. (e.g. Thu, 21 Dec 2000 16:01:07 +0200)
 *        U - Seconds since Unix Epoch.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *----
 *
 *  strftime | strfutc -> POSIX date formatting. (Work-in-progress)
 *
 *    Syntax: Time.strftime(format [, time])
 *
 *      format <String>: A string representing the date format.
 *
 *        %a - Abbreviated week. (Sun - Sat)
 *        %A - Full week. (Sunday - Saturday)
 *        %b - Abbreviated month. (Jan - Dec)
 *        %B - Full month. (January - December)
 *        %c - Locale date and time. (based on Date#toLocaleString)
 *        %C - Century. (year / 100)
 *        %d - Day of the month with leading zeros.
 *        %D - Equivalent to "%m/%d/%y".
 *        %e - Day of the month with leading spaces.
 *        %E - [unsupported] POSIX locale extensions.
 *        %F - Equivalent to "%Y-%m-%d".
 *        %g - 2-digit year containing majority of the Monday-start week.
 *        %G - 4-digit year containing majority of the Monday-start week.
 *        %h - %b
 *        %H - Hour of 24-hour clock with leading zeros.
 *        %I - Hour of 12-hour clock with leading zeros.
 *        %j - Day of the year with leading zeros. (000 - 366)
 *        %k - Hour of 24-hour clock with leading spaces.
 *        %l - Hour of 12-hour clock with leading spaces.
 *        %m - Numeric month with leading zeros.
 *        %M - Minutes with leading spaces.
 *        %n - newline.
 *        %N - Milliseconds with leading zeros.
 *        %O - [unsupported] POSIX locale extensions.
 *        %p - Uppercase ante meridiem or post meridiem.
 *        %P - Lowercase ante meridiem or post meridiem.
 *        %r - Equivalent to "%I:%M:%S %p".
 *        %R - Equivalent to "%H:%M".
 *        %s - Seconds since Unix Epoch.
 *        %S - Seconds with leading zeros.
 *        %t - tab.
 *        %T - Equivalent to "%H:%M:%S".
 *        %u - Day of the week. (1 - 7 <=> Mon - Sun)
 *        %U - Week number of the year, Sunday-start, with leading zeros.
 *        %v - Equivalent to "%e-%b-%Y".
 *        %V - Week number of %G year, Monday-start, with leading zeros.
 *        %w - Day of the week. (0 - 6 <=> Sun - Sat)
 *        %W - Week number of the year, Monday-start, with leading zeros.
 *        %x - Locale date. (based on Date#toLocaleDateString)
 *        %X - Locale time. (based on Date#toLocaleTimeString)
 *        %y - 2-digit year.
 *        %Y - 4-digit year.
 *        %z - Offset from UTC. (e.g. -0600)
 *        %Z - [unsupported] Timezone name.
 *        %% - Percent sign.
 *
 *      time <Mixed>: A date value. <Date>, <Number>, or <String>.
 *
 *    Return: <String>: A formatted date string.
 *
 *      <undefined>: `time` created an invalid .
 *
 *      <null>: Out of range. Range: Jan 1, 0000 to Dec 31, 9999.
 *
 **~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
**/

var Time = new (function () {
  this.Version = '<%= serial %>';
  
<%= inc 'core.js' %>
  
<%= inc 'php.js', 'posix.js' %>

<%= inc 'lang.js', 'locale.js', 'shared.js' %>


/**~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *  CGU-Stand :: Time :: Requires
**/
<%= req 2, 'type' %>
  
})();
