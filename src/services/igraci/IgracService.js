import { igraci } from "./IgracPodaci";

async function get(){
    return {data: [...igraci]}
}

export default{
    get
}