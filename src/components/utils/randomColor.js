export default function ()
{
    var css_hsl =   "hsl(" + 360 * Math.random() + ',' +
                    (20 + 70 * Math.random()) + '%,' +
                    (70 + 10 * Math.random()) + '%)';

    //return '#'+(0x1000000+(Math.random())*0xffffff).toString(16).substr(1,6);

    return css_hsl;
}