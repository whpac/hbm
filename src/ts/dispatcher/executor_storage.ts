import RequestExecutor from './request_executor';

export default interface ExecutorStorage {

    Retrieve(executor_id: string): RequestExecutor | undefined;
}