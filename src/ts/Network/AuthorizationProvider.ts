export default interface AuthorizationProvider {

    Authorize(xhr: XMLHttpRequest): void;
}