/**
 * Validate file type
 * @param {*} file_type 
 * @param {*} ext 
 */
export default function (file_type, ext)
{
    var type = file_type.split('/')[0];
    var extension = file_type.split('/')[1];

    if (type === 'video') {
        return (extension === ext) ? true : false;
    } else if (type === 'text') {
        return (extension === ext) ? true : false;
    }
}