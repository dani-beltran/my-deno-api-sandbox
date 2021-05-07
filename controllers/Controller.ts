import { Request, Response } from '../deps.ts';

export class Controller {

  static sendResponse(res: Response, payload: any) {
    /**
    * The default res-code is 200. We want to allow to change that. in That case,
    * payload will be an object consisting of a code and a payload. If not customized
    * send 200 and the payload as received in this method.
    */
    res.setStatus(payload.code || 200);
    const responsePayload = payload.payload !== undefined ? payload.payload : payload;
    if (responsePayload instanceof Object) {
      res.json(responsePayload);
    } else {
      res.end(responsePayload);
    }
  }

  static sendError(res: Response, error: any) {
    res.setStatus(error.code || 500);
    if (error.error instanceof Object) {
      res.json(error.error);
    } else {
      res.end(error.error || error.message);
    }
  }

  // static collectFile(req: Request, fieldName: string) {
  //   let uploadedFileName = '';
  //   if (req.files && req.files.length > 0) {
  //     const fileObject = req.files.find(file => file.fieldname === fieldName);
  //     if (fileObject) {
  //       const fileArray = fileObject.originalname.split('.');
  //       const extension = fileArray.pop();
  //       fileArray.push(`_${Date.now()}`);
  //       uploadedFileName = `${fileArray.join('')}.${extension}`;
  //       fs.renameSync(path.join(config.FILE_UPLOAD_PATH, fileObject.filename),
  //         path.join(config.FILE_UPLOAD_PATH, uploadedFileName));
  //     }
  //   }
  //   return uploadedFileName;
  // }

  // static getRequestBodyName(req: Request) {
  //   const codeGenDefinedBodyName = req.openapi.schema['x-codegen-req-body-name'];
  //   if (codeGenDefinedBodyName !== undefined) {
  //     return codeGenDefinedBodyName;
  //   }
  //   const refObjectPath = req.openapi.schema.requestBody.content['application/json'].schema.$ref;
  //   if (refObjectPath !== undefined && refObjectPath.length > 0) {
  //     return (refObjectPath.substr(refObjectPath.lastIndexOf('/') + 1));
  //   }
  //   return 'body';
  // }

  // static collectRequestParams(req: Request) {
  //   const requestParams = {};
  //   if (req.openapi.schema.requestBody !== undefined) {
  //     const { content } = req.openapi.schema.requestBody;
  //     if (content['application/json'] !== undefined) {
  //       const requestBodyName = camelCase(this.getRequestBodyName(req));
  //       requestParams[requestBodyName] = req.body;
  //     } else if (content['multipart/form-data'] !== undefined) {
  //       Object.keys(content['multipart/form-data'].schema.properties).forEach(
  //         (property) => {
  //           const propertyObject = content['multipart/form-data'].schema.properties[property];
  //           if (propertyObject.format !== undefined && propertyObject.format === 'binary') {
  //             requestParams[property] = this.collectFile(req, property);
  //           } else {
  //             requestParams[property] = req.body[property];
  //           }
  //         },
  //       );
  //     }
  //   }

  //   req.openapi.schema.parameters.forEach((param) => {
  //     if (param.in === 'path') {
  //       requestParams[param.name] = req.openapi.pathParams[param.name];
  //     } else if (param.in === 'query') {
  //       requestParams[param.name] = req.query[param.name];
  //     } else if (param.in === 'header') {
  //       requestParams[param.name] = req.headers[param.name];
  //     }
  //   });
  //   return requestParams;
  // }


  static async handleRequest(req: Request, res: Response, serviceOperation: any) {
    try {
      // const serviceResponse = await serviceOperation(this.collectRequestParams(req));
      const serviceResponse = await serviceOperation();
      Controller.sendResponse(res, serviceResponse);
    } catch (error) {
      Controller.sendError(res, error);
    }
  }
}