import keyword_extractor from 'keyword-extractor';

export default function (sentence)
{
    let keywords = keyword_extractor.extract(sentence,{
        language:"english",
        remove_digits: true,
        return_changed_case: true,
        remove_duplicates: false
    });
    return keywords;
}