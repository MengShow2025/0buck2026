import pytest
from unittest.mock import MagicMock, patch
from app.workers.im_tasks import im_brain_process_task

@patch('app.workers.im_tasks.asyncio.run')
@patch('app.api.im_gateway.generic_brain_process')
def test_im_brain_process_task_success(mock_generic_brain, mock_asyncio_run):
    # Process IM message
    result = im_brain_process_task(
        platform="telegram", 
        platform_uid="user_123", 
        text="Hello bot", 
        chat_id="chat_456", 
        chat_type="private"
    )
    
    # Assert asyncio.run is called
    mock_asyncio_run.assert_called_once()
    
    # Extract the coroutine passed to asyncio.run
    args, kwargs = mock_asyncio_run.call_args
    coro = args[0]
    # We should close the coroutine to avoid RuntimeWarning
    coro.close()

@patch('app.workers.im_tasks.asyncio.run')
@patch('app.api.im_gateway.generic_brain_process')
def test_im_brain_process_task_fallback_platform(mock_generic_brain, mock_asyncio_run):
    # Process IM message with unknown platform
    result = im_brain_process_task(
        platform="unknown_platform", 
        platform_uid="user_123", 
        text="Hello bot", 
        chat_id="chat_456", 
        chat_type="private"
    )
    
    # Assert asyncio.run is called
    mock_asyncio_run.assert_called_once()
    
    args, kwargs = mock_asyncio_run.call_args
    coro = args[0]
    coro.close()

@patch('app.workers.im_tasks.im_brain_process_task.retry')
@patch('app.workers.im_tasks.asyncio.run')
@patch('app.api.im_gateway.generic_brain_process')
def test_im_brain_process_task_retry_on_error(mock_generic_brain, mock_asyncio_run, mock_retry):
    mock_asyncio_run.side_effect = Exception("LLM connection timeout")
    mock_retry.side_effect = Exception("RetryTriggered")
    
    with pytest.raises(Exception, match="RetryTriggered"):
        im_brain_process_task(
            platform="telegram", 
            platform_uid="user_123", 
            text="Hello bot", 
            chat_id="chat_456", 
            chat_type="private"
        )
        
    args, kwargs = mock_asyncio_run.call_args
    if args and len(args) > 0:
        coro = args[0]
        coro.close()
