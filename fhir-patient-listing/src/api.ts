import axios from 'axios'

//export const fhirBaseUrl = "https://hapi.fhir.org/baseR4";
export const fhirBaseUrl = "http://localhost:8181/fhir";

export const fhirApi = axios.create({baseURL:fhirBaseUrl,headers:{
    //https://hapifhir.io/hapi-fhir/docs/server_jpa/configuration.html
    'Cache-Control':'no-cache'
}})