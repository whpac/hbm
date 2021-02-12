import MalformedResponseException from './MalformedResponseException';
import NetworkErrorException from './NetworkErrorException';
import RequestFailedException from './RequestFailedException';
import { RequestMethod } from './RequestMethod';
import RequestOptions from './RequestOptions';

type HttpResponse = {
    Status: number;
    StatusText: string;
    Response: any;
};
type ResolveFunction = (value: HttpResponse | PromiseLike<HttpResponse>) => void;
type RejectFunction = (reason?: any) => void;

export default class Http {

    /**
     * Performs an HTTP request to the given URL
     * @param url The target address
     * @param options Options of the request
     */
    public static Request(url: string, options: Partial<RequestOptions> = {}) {
        let request_options: RequestOptions = {
            Method: RequestMethod.GET,
            Payload: {}
        };
        request_options = Object.assign(request_options, options);

        if(!this.IsConnected()) {
            throw new NetworkErrorException('Brak połączenia internetowego.');
        }

        let serialized_data = this.SerializePayload(request_options.Payload);

        return new Promise<HttpResponse>(async (resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(request_options.Method, url, true);
            xhr.onreadystatechange = Http.OnReadyStateChange(resolve, reject);
            xhr.onerror = () => { reject(new NetworkErrorException('Wystąpił błąd połączenia internetowego.')); };

            if(serialized_data !== undefined) xhr.setRequestHeader('Content-Type', 'application/json');

            xhr.send(serialized_data);
        });
    }

    protected static IsConnected() {
        return window.navigator.onLine;
    }

    protected static SerializePayload(payload: any): string | undefined {
        if(payload === undefined) return undefined;
        return JSON.stringify(payload);
    }

    /**
     * Processes every event of XHR state change
     * @param resolve Function to be called in order to resolve the promise
     * @param reject Function to be called in order to reject the promise
     */
    protected static OnReadyStateChange(resolve: ResolveFunction, reject: RejectFunction) {
        return function (this: XMLHttpRequest) {
            let xhr = this;
            if(xhr.readyState != 4) return;

            if(xhr.status >= 200 && xhr.status < 300) {
                let parsed_json = {};
                if(xhr.responseText !== '') {
                    try {
                        parsed_json = JSON.parse(xhr.responseText);
                    } catch(e) {
                        console.error('Odpowiedź serwera zawiera niepoprawny JSON');
                        return reject(new MalformedResponseException('Serwer zwrócił odpowiedź w nieznanym formacie.', {
                            Status: xhr.status,
                            StatusText: xhr.statusText,
                            ResponseText: xhr.responseText
                        }));
                    }
                }

                return resolve({
                    Status: xhr.status,
                    StatusText: xhr.statusText,
                    Response: parsed_json,
                });
            } else {
                let parsed_json: any = {};
                if(xhr.responseText !== '') {
                    try {
                        parsed_json = JSON.parse(xhr.responseText);
                    } catch(e) { }
                }

                console.error('Serwer nie mógł zrealizować żądania. Kod odpowiedzi: ' + xhr.status);
                let message = 'Serwer nie był w stanie zrealizować żądania.';

                if('message' in parsed_json) {
                    message = parsed_json.message;
                }

                return reject(new RequestFailedException(message, {
                    Status: xhr.status,
                    StatusText: xhr.statusText,
                    Response: parsed_json
                }));
            }
        };
    }
}