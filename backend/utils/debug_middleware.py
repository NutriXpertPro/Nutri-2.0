import json

class Debug400Middleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        
        # Log profile updates even if successful
        is_profile_update = request.path == "/api/v1/users/me/" and request.method == "PATCH"
        
        if response.status_code >= 400 or is_profile_update:
            prefix = "DEBUG PROFILE UPDATE" if is_profile_update else f"HTTP ERROR DEBUG ({response.status_code})"
            print(f"\n{'!'*20} {prefix} {'!'*20}")
            print(f"Path: {request.path}")
            print(f"Method: {request.method}")
            print(f"Content-Type: {request.content_type}")
            
            log_entry = f"\n--- {prefix} {response.status_code} ---\nPath: {request.path}\nMethod: {request.method}\n"
            
            try:
                body_peek = request.body.decode('utf-8', errors='ignore')[:1000]
                print(f"Body: {body_peek}")
                log_entry += f"Body: {body_peek}\n"
            except:
                print("Could not read body")
            
            if request.FILES:
                files_info = [f"{k}: {v.name} ({v.size} bytes)" for k, v in request.FILES.items()]
                print(f"Files: {files_info}")
                log_entry += f"Files: {files_info}\n"

            try:
                resp_peek = response.content.decode('utf-8', errors='ignore')[:1000]
                print(f"Response Content: {resp_peek}")
                log_entry += f"Response: {resp_peek}\n"
            except:
                print("Could not read response content")
            print(f"{'!'*60}\n")
            
            # Also log to a file
            log_file = "c:\\Nutri 4.0\\backend\\error_diagnostics.log"
            try:
                with open(log_file, "a", encoding="utf-8") as f:
                    f.write(log_entry)
            except:
                pass

        return response
