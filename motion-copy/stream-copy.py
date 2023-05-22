import concurrent.futures
import ffmpeg
import os
import schedule
import time


def convert_rtsp_to_hls(rtsp_url, output_dir):
    (
        ffmpeg.input(rtsp_url, rtsp_transport="tcp")
        .output(
            f"{output_dir}/playlist.m3u8",
            hls_segment_filename=f"{output_dir}/segment_%v-%03d.ts",
            acodec="copy",
            vcodec="copy",
            format="hls",
            hls_time=60,
            hls_list_size=30,
        )
        .run()
    )


def cleanup_files(output_dir):
    current_time = time.time()
    for filename in os.listdir(output_dir):
        file_path = os.path.join(output_dir, filename)
        if (
            os.path.isfile(file_path)
            and current_time - os.path.getmtime(file_path) > 4200
        ):  # 70 minutes = 4200 seconds
            os.remove(file_path)


# Example streams and output directories
streams = [
    {
        "rtsp_url": "rtsp://admin:tAThGG2NAr5vjY5@192.168.2.21/Streaming/Channels/101/",
        "output_dir": "temp",
    },
    # Add more streams as needed
]

# Create a thread pool executor
executor = concurrent.futures.ThreadPoolExecutor()

# Submit each conversion task to the executor
conversion_tasks = [
    executor.submit(convert_rtsp_to_hls, stream["rtsp_url"], stream["output_dir"])
    for stream in streams
]


# Define a function for the file cleanup task
def file_cleanup_task():
    for stream in streams:
        cleanup_files(stream["output_dir"])


# Schedule the file cleanup task to run every 60 minutes
schedule.every(60).minutes.do(file_cleanup_task)

# Start an infinite loop to run scheduled tasks
while True:
    schedule.run_pending()
    time.sleep(30)

# Shutdown the executor (this code is unreachable as the infinite loop runs indefinitely)
executor.shutdown()
