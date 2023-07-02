// @ts-nocheck
import Scraper from "../googlemaps/scraper";
import * as fs from 'fs';

const parseProcess = () => {
    const start = process.argv.indexOf("-n")+1;
    const end = process.argv.indexOf("-l");

    return {
        query:process.argv.slice(start,end).join(' '),
        location:process.argv.slice(end+1,).join(' '),
    }
};

const writeFile = (name:string,data:string) => {
    fs.writeFile(`${name}.json`,data, (err) => {
        if(err) {
            console.log(err)
        } else {
            console.log(`file write to ${process.pwd}`)
        }
    })
}

( () => {
    const {query,location} = parseProcess();
    console.log({query,location});
    const scraper = new Scraper(query,location);
    const data = scraper.getPlacesInfo(query,location);
    data.then(res => writeFile(
        `${query}_${location}`,
        JSON.stringify(res)
    )
    )
}
)()
