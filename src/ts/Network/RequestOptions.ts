import { RequestMethod } from './RequestMethod';

export default interface RequestOptions {
    Method: RequestMethod;
    Payload: any;
}