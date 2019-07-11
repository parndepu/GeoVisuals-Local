export default function ()
{
    var css_hsl =   "hsl(" + 360 * Math.random() + ',' +
                    (25 + 70 * Math.random()) + '%,' +
                    (85 + 10 * Math.random()) + '%)';

    return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);
}