import axios from 'axios';

export default class AlertService {
    constructor(){
    }

    public async getAlertFromCDS() {
      
      var component = {
          "component": {
              "npmjs.org": {
                  "name": "marked",
                  "version": "0.3.9"
              }
          }
      };

      const response = await axios({
          method: 'post',
          url: 'https://cds.cg.microsoft.com/api/searches?$expand=vulnerabilities',
          data: component          
      })

      return response.data
    }
}

let alertService: AlertService;

export async function getAlertService() {
    if (alertService) {
      return alertService;
    }
    alertService = new AlertService();
    return alertService;
}