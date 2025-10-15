import tkinter as tk
from tkinter import messagebox, ttk
import json
import os
from datetime import datetime
import uuid
import re

# --- Configuration and Constants ---

# File Paths for persistence
LOGS_FILE = 'communication_logs.json'
USERS_FILE = 'user_credentials.json'
ACCESS_LOG_FILE = 'access_history.json'

# Default user setup with roles and restrictions
# 'restrictions' list contains features the user CANNOT access.
DEFAULT_USER_DATA = {
    "admin": {"password": "password123", "role": "admin", "restrictions": []},
    "analyst": {"password": "secure456", "role": "user", "restrictions": ["admin_logs", "user_management", "remove_logs"]}
}

# Predefined Suspicious Keywords (Customize this list)
SUSPICIOUS_WORDS = [
    "bomb", "attack", "target", "secret", "meeting", "code word",
    "transfer", "withdraw", "hide", "dispose", "burner phone"
]

# --- Helper Functions for File I/O and Persistence ---

def load_data(filepath, default_data={}):
    """Loads data from a JSON file."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError):
            return default_data
    return default_data

def save_data(filepath, data):
    """Saves data to a JSON file."""
    try:
        with open(filepath, 'w') as f:
            json.dump(data, f, indent=4)
    except IOError as e:
        print(f"Error saving data to {filepath}: {e}")

# --- Main Application Class ---

class LogAnalyzerApp:
    def __init__(self, master):
        self.master = master
        master.title("Secure Communication Log Analyzer")
        master.geometry("1200x800")
        master.config(bg='#f0f4f8')
        master.resizable(True, True)

        # Initialize data structures with updated default user structure
        self.logs = load_data(LOGS_FILE, default_data=[])
        # IMPORTANT: If the USERS_FILE exists, it will load whatever format it has (old string or new dict)
        self.users = load_data(USERS_FILE, default_data=DEFAULT_USER_DATA) 
        self.access_history = load_data(ACCESS_LOG_FILE, default_data=[])

        self.current_user = None
        self.is_authenticated = False

        # Apply a modern style (especially for Treeview)
        style = ttk.Style()
        style.theme_use('clam')
        style.configure("Treeview.Heading", font=('Inter', 10, 'bold'), background="#3b82f6", foreground="white")
        style.configure("Treeview", font=('Inter', 10), rowheight=25)
        style.map("Treeview", background=[('selected', '#10b981')])

        self.setup_login_screen()

    # --- Authentication and Logging ---

    def setup_login_screen(self):
        """Creates the initial login interface."""
        self.login_frame = tk.Frame(self.master, padx=40, pady=40, bg='#ffffff', relief=tk.RAISED, bd=2)
        self.login_frame.place(relx=0.5, rely=0.5, anchor=tk.CENTER)

        tk.Label(self.login_frame, text="Log Analyzer Access", font=('Inter', 18, 'bold'), bg='#ffffff', fg='#1f2937').grid(row=0, column=0, columnspan=2, pady=(0, 20))

        # Username
        tk.Label(self.login_frame, text="Username:", font=('Inter', 12), bg='#ffffff', fg='#4b5563').grid(row=1, column=0, sticky='w', pady=10)
        self.username_entry = tk.Entry(self.login_frame, font=('Inter', 12), width=30, relief=tk.FLAT, bd=1, highlightthickness=1)
        self.username_entry.grid(row=1, column=1, padx=10)
        self.username_entry.config(highlightbackground="#d1d5db", highlightcolor="#3b82f6")

        # Password
        tk.Label(self.login_frame, text="Password:", font=('Inter', 12), bg='#ffffff', fg='#4b5563').grid(row=2, column=0, sticky='w', pady=10)
        self.password_entry = tk.Entry(self.login_frame, font=('Inter', 12), show='*', width=30, relief=tk.FLAT, bd=1, highlightthickness=1)
        self.password_entry.grid(row=2, column=1, padx=10)
        self.password_entry.config(highlightbackground="#d1d5db", highlightcolor="#3b82f6")
        self.password_entry.bind('<Return>', lambda event: self.attempt_login())

        # Login Button
        login_btn = tk.Button(self.login_frame, text="Login", command=self.attempt_login, bg='#3b82f6', fg='white', font=('Inter', 12, 'bold'), padx=20, pady=8, relief=tk.FLAT, activebackground='#2563eb', activeforeground='white')
        login_btn.grid(row=3, column=0, columnspan=2, pady=20)

    def attempt_login(self):
        """
        Checks credentials, handling both the old (string) and new (dict) password structure
        for backward compatibility.
        """
        username = self.username_entry.get()
        password = self.password_entry.get()

        is_valid = False
        
        if username in self.users:
            user_info = self.users[username]
            
            # 1. Check for the new dictionary structure (current standard)
            if isinstance(user_info, dict):
                if user_info.get('password') == password:
                    is_valid = True
            
            # 2. Check for the old string structure (legacy compatibility)
            elif isinstance(user_info, str):
                if user_info == password:
                    is_valid = True
                    
        if is_valid:
            self.current_user = username
            self.is_authenticated = True
            self.log_action(f"Successful login by user: {username}")
            self.login_frame.destroy()
            self.setup_main_app()
        else:
            messagebox.showerror("Login Failed", "Invalid Username or Password.")
            self.log_action(f"Failed login attempt for user: {username}")

    def log_action(self, action_description):
        """Records user access and actions."""
        log_entry = {
            "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "user": self.current_user if self.current_user else "Unauthenticated",
            "action": action_description
        }
        self.access_history.append(log_entry)
        save_data(ACCESS_LOG_FILE, self.access_history)

    def check_access(self, feature_name):
        """
        Checks if the current user has access to a feature based on restrictions.
        Safely handles legacy string data format to prevent AttributeError and ensures
        the default 'admin' account always retains full privileges, even with old data.
        """
        user_info = self.users.get(self.current_user)

        # 1. Handle Legacy String Format (old password only stored)
        if isinstance(user_info, str):
            # Check if this is the default 'admin' account. If so, grant full access.
            if self.current_user == "admin":
                return True
            
            # For all other legacy accounts (that are not 'admin'), restrict administrative features.
            if feature_name in ["admin_logs", "user_management", "remove_logs"]:
                messagebox.showwarning("Access Denied", f"User '{self.current_user}' is using a legacy account structure and cannot access administrative features.")
                self.log_action(f"Access denied for '{feature_name}' to legacy user: {self.current_user}")
                return False
            # Allow access to non-restricted features (like viewing/adding logs) for other legacy users
            return True
        
        # 2. Handle New Dictionary Format
        if isinstance(user_info, dict):
            # Retrieve the restrictions list, defaulting to full restriction if list is missing/corrupted
            restrictions = user_info.get('restrictions', ["all"]) 
        else:
            # Fallback for None or unexpected data type (maximum restriction)
            restrictions = ["all"]

        if feature_name in restrictions:
            messagebox.showwarning("Access Denied", f"User '{self.current_user}' does not have permission to perform '{feature_name}'.")
            self.log_action(f"Access denied for '{feature_name}' to user: {self.current_user}")
            return False
        return True

    def logout(self):
        """Logs out the current user and returns to the login screen."""
        self.log_action(f"User logged out: {self.current_user}")
        self.current_user = None
        self.is_authenticated = False
        self.main_frame.destroy()
        self.setup_login_screen()

    # --- Main Application UI ---

    def setup_main_app(self):
        """Creates the main application dashboard."""
        self.main_frame = tk.Frame(self.master, bg='#f0f4f8')
        self.main_frame.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        # Title and Logout Frame
        title_frame = tk.Frame(self.main_frame, bg='#f0f4f8')
        title_frame.pack(fill='x', pady=10)

        tk.Label(title_frame, text=f"Welcome, {self.current_user} - Communication Log Dashboard", font=('Inter', 16, 'bold'), bg='#f0f4f8', fg='#1f2937').pack(side=tk.LEFT, padx=(10, 0))

        logout_btn = tk.Button(title_frame, text="Logout", command=self.logout, bg='#f43f5e', fg='white', font=('Inter', 10, 'bold'), padx=15, pady=5, relief=tk.FLAT, activebackground='#e11d48')
        logout_btn.pack(side=tk.RIGHT, padx=10)

        # Notebook for organization (Data Entry / Log View / Admin Logs / User Management)
        self.notebook = ttk.Notebook(self.main_frame)
        self.notebook.pack(pady=5, padx=5, fill="both", expand=True)

        self.setup_data_entry_tab()
        self.setup_log_view_tab()
        
        # Role-based restriction checks for administrative tabs
        if self.check_access("admin_logs"):
            self.setup_admin_logs_tab()

        if self.check_access("user_management"):
            self.setup_user_management_tab()
        
        self.populate_logs_treeview()

    # --- Date/Time Helper for Dropdowns ---
    
    def get_datetime_options(self):
        """Generates options for date and time comboboxes."""
        current_year = datetime.now().year
        
        # Years: current year and 5 years back/forward
        years = [str(y) for y in range(current_year - 5, current_year + 6)]
        
        # Days/Months (simple list for drop down)
        days = [f"{d:02d}" for d in range(1, 32)]
        months = [f"{m:02d}" for m in range(1, 13)]

        # Time
        hours = [f"{h:02d}" for h in range(0, 24)]
        minutes = [f"{m:02d}" for m in range(0, 60)]
        seconds = [f"{s:02d}" for s in range(0, 60)]
        
        # Set defaults to current date/time
        now = datetime.now()
        defaults = {
            'year': str(now.year), 
            'month': f"{now.month:02d}", 
            'day': f"{now.day:02d}",
            'hour': f"{now.hour:02d}", 
            'minute': f"{now.minute:02d}", 
            'second': f"{now.second:02d}",
        }

        return {
            'years': years, 'months': months, 'days': days,
            'hours': hours, 'minutes': minutes, 'seconds': seconds,
            'defaults': defaults
        }


    # --- Tab 1: Data Entry ---

    def setup_data_entry_tab(self):
        """Sets up the frame for adding new communication logs."""
        data_entry_frame = tk.Frame(self.notebook, bg='#ffffff', padx=20, pady=20)
        self.notebook.add(data_entry_frame, text="Add New Log Entry")

        # Use a grid layout for the form
        form_frame = tk.Frame(data_entry_frame, bg='#ffffff')
        form_frame.pack(pady=10)

        row = 0
        self.fields = {}
        dt_options = self.get_datetime_options()

        # Data Type Selector
        tk.Label(form_frame, text="1. Message Type:", font=('Inter', 10, 'bold'), bg='#ffffff', anchor='w').grid(row=row, column=0, sticky='w', padx=5, pady=5)
        self.data_type_var = tk.StringVar(value="Text")
        ttk.Combobox(form_frame, textvariable=self.data_type_var, values=["Text", "Audio", "Video", "Call"], state="readonly", font=('Inter', 10)).grid(row=row, column=1, sticky='ew', padx=5, pady=5)
        self.data_type_var.trace_add("write", lambda name, index, mode: self.update_content_field())
        row += 1

        # Common Fields (Sender/Receiver Names/Gender)
        common_fields = [
            ("Sender Name:", "sender_name"), ("Receiver Name:", "receiver_name"),
            ("Sender Gender (M/F/O):", "sender_gender"), ("Receiver Gender (M/F/O):", "receiver_gender")
        ]
        for label_text, var_name in common_fields:
            tk.Label(form_frame, text=label_text, font=('Inter', 10, 'bold'), bg='#ffffff', anchor='w').grid(row=row, column=0, sticky='w', padx=5, pady=5)
            entry = tk.Entry(form_frame, font=('Inter', 10), width=50)
            entry.grid(row=row, column=1, sticky='ew', padx=5, pady=5)
            self.fields[var_name] = entry
            row += 1

        # Date Selection Dropdowns (DD-MM-YYYY)
        tk.Label(form_frame, text="Date (DD-MM-YYYY):", font=('Inter', 10, 'bold'), bg='#ffffff', anchor='w').grid(row=row, column=0, sticky='w', padx=5, pady=5)
        date_frame = tk.Frame(form_frame, bg='#ffffff')
        date_frame.grid(row=row, column=1, sticky='ew', padx=5, pady=5)
        
        # Day (DD)
        self.fields['day_var'] = tk.StringVar(value=dt_options['defaults']['day'])
        day_cb = ttk.Combobox(date_frame, textvariable=self.fields['day_var'], values=dt_options['days'], state="readonly", font=('Inter', 10), width=4)
        day_cb.pack(side=tk.LEFT, padx=2)
        
        # Month (MM)
        self.fields['month_var'] = tk.StringVar(value=dt_options['defaults']['month'])
        month_cb = ttk.Combobox(date_frame, textvariable=self.fields['month_var'], values=dt_options['months'], state="readonly", font=('Inter', 10), width=4)
        month_cb.pack(side=tk.LEFT, padx=2)
        
        # Year (YYYY)
        self.fields['year_var'] = tk.StringVar(value=dt_options['defaults']['year'])
        year_cb = ttk.Combobox(date_frame, textvariable=self.fields['year_var'], values=dt_options['years'], state="readonly", font=('Inter', 10), width=6)
        year_cb.pack(side=tk.LEFT, padx=2)
        
        row += 1

        # Time Selection Dropdowns
        tk.Label(form_frame, text="Time (HH:MM:SS):", font=('Inter', 10, 'bold'), bg='#ffffff', anchor='w').grid(row=row, column=0, sticky='w', padx=5, pady=5)
        time_frame = tk.Frame(form_frame, bg='#ffffff')
        time_frame.grid(row=row, column=1, sticky='ew', padx=5, pady=5)

        # Hour
        self.fields['hour_var'] = tk.StringVar(value=dt_options['defaults']['hour'])
        hour_cb = ttk.Combobox(time_frame, textvariable=self.fields['hour_var'], values=dt_options['hours'], state="readonly", font=('Inter', 10), width=4)
        hour_cb.pack(side=tk.LEFT, padx=2)

        # Minute
        self.fields['minute_var'] = tk.StringVar(value=dt_options['defaults']['minute'])
        minute_cb = ttk.Combobox(time_frame, textvariable=self.fields['minute_var'], values=dt_options['minutes'], state="readonly", font=('Inter', 10), width=4)
        minute_cb.pack(side=tk.LEFT, padx=2)

        # Second
        self.fields['second_var'] = tk.StringVar(value=dt_options['defaults']['second'])
        second_cb = ttk.Combobox(time_frame, textvariable=self.fields['second_var'], values=dt_options['seconds'], state="readonly", font=('Inter', 10), width=4)
        second_cb.pack(side=tk.LEFT, padx=2)

        row += 1
        
        # Content/Duration Field (Dynamically updated)
        tk.Label(form_frame, text="Content/Duration:", font=('Inter', 10, 'bold'), bg='#ffffff', anchor='w').grid(row=row, column=0, sticky='w', padx=5, pady=5)
        self.content_field_label = tk.Label(form_frame, text="Message Content (Text)", font=('Inter', 10), bg='#ffffff', fg='#4b5563', anchor='w')
        self.content_field_label.grid(row=row+1, column=0, sticky='w', padx=5)

        self.content_text_area = tk.Text(form_frame, height=5, width=50, font=('Inter', 10))
        self.content_text_area.grid(row=row+1, column=1, sticky='ew', padx=5, pady=5)
        self.content_text_entry = tk.Entry(form_frame, font=('Inter', 10), width=50) # For file name/duration

        self.fields['content_or_duration'] = self.content_text_area # Default to text area
        row += 2

        # Add Button
        add_btn = tk.Button(data_entry_frame, text="Add Log Entry", command=self.add_log_entry, bg='#10b981', fg='white', font=('Inter', 12, 'bold'), padx=20, pady=10, relief=tk.FLAT, activebackground='#059669')
        add_btn.pack(pady=20)

        self.update_content_field() # Initial setup

    def update_content_field(self):
        """Swaps the content input field based on the selected type."""
        selected_type = self.data_type_var.get()
        
        # Clear existing content field
        if self.fields.get('content_or_duration') == self.content_text_area:
            self.content_text_area.grid_forget()
        elif self.fields.get('content_or_duration') == self.content_text_entry:
            self.content_text_entry.grid_forget()

        # Update label and entry based on type
        if selected_type == "Text":
            self.content_field_label.config(text="Message Content (Text)")
            self.content_text_area.grid(row=7, column=1, sticky='ew', padx=5, pady=5)
            self.fields['content_or_duration'] = self.content_text_area
        elif selected_type in ["Audio", "Video"]:
            self.content_field_label.config(text="File Name (e.g., 'recording.mp3')")
            self.content_text_entry.grid(row=7, column=1, sticky='ew', padx=5, pady=5)
            self.fields['content_or_duration'] = self.content_text_entry
        elif selected_type == "Call":
            self.content_field_label.config(text="Duration (seconds, e.g., '120')")
            self.content_text_entry.grid(row=7, column=1, sticky='ew', padx=5, pady=5)
            self.fields['content_or_duration'] = self.content_text_entry

    def check_for_suspicious_words(self, text_content):
        """Checks if the text content contains any suspicious words."""
        if not text_content:
            return False
        # Use regex to find whole words, case-insensitive
        pattern = r'\b(?:' + '|'.join(re.escape(word) for word in SUSPICIOUS_WORDS) + r')\b'
        return bool(re.search(pattern, text_content, re.IGNORECASE))

    def add_log_entry(self):
        """Validates and adds a new log entry to the data."""
        
        # Construct Date and Time strings from Comboboxes in DD-MM-YYYY format
        try:
            date_str = f"{self.fields['day_var'].get()}-{self.fields['month_var'].get()}-{self.fields['year_var'].get()}"
            time_str = f"{self.fields['hour_var'].get()}:{self.fields['minute_var'].get()}:{self.fields['second_var'].get()}"
            
            # Basic validation check using datetime parsing, expecting DD-MM-YYYY
            datetime.strptime(date_str, "%d-%m-%Y")
            datetime.strptime(time_str, "%H:%M:%S")

        except ValueError:
            # This handles cases where the date/time combination is invalid (e.g., Feb 30) or fields are empty
            messagebox.showerror("Error", "Invalid Date or Time selection. Please ensure all date/time fields are correctly selected.")
            return

        data = {
            "id": str(uuid.uuid4()),
            "type": self.data_type_var.get(),
            "sender_name": self.fields['sender_name'].get().strip(),
            "receiver_name": self.fields['receiver_name'].get().strip(),
            "sender_gender": self.fields['sender_gender'].get().strip().upper(),
            "receiver_gender": self.fields['receiver_gender'].get().strip().upper(),
            "date": date_str,
            "time": time_str,
        }

        # Get content/duration based on the current field type
        if data['type'] == "Text":
            content = self.fields['content_or_duration'].get("1.0", tk.END).strip()
        else:
            content = self.fields['content_or_duration'].get().strip()
        data['content_or_duration'] = content
        
        # Validation for Content
        required_content = ["content_or_duration"]
        if any(not data.get(field) for field in required_content):
            messagebox.showerror("Error", "Please fill in all Sender/Receiver details and the Content/Duration field.")
            return

        # Check for suspicious words
        if data['type'] == "Text":
            data['is_suspicious'] = self.check_for_suspicious_words(content)
        else:
            data['is_suspicious'] = False

        self.logs.append(data)
        save_data(LOGS_FILE, self.logs)
        self.populate_logs_treeview()

        # Clear form fields (except date/time)
        for var_name in ['sender_name', 'receiver_name', 'sender_gender', 'receiver_gender']:
            self.fields[var_name].delete(0, tk.END)
        
        if self.fields.get('content_or_duration') == self.content_text_area:
            self.content_text_area.delete("1.0", tk.END)
        else:
            self.content_text_entry.delete(0, tk.END)

        self.log_action(f"Added new {data['type']} log entry with ID: {data['id']}")
        messagebox.showinfo("Success", "Log entry added successfully.")


    # --- Tab 2: Log View and Analysis ---

    def setup_log_view_tab(self):
        """Sets up the frame for viewing, searching, and removing log entries."""
        log_view_frame = tk.Frame(self.notebook, bg='#f0f4f8', padx=10, pady=10)
        self.notebook.add(log_view_frame, text="Log Data View & Search")

        # 1. Search and Filter Controls (Frame at the top)
        filter_frame = tk.Frame(log_view_frame, bg='#ffffff', padx=10, pady=10, relief=tk.GROOVE)
        filter_frame.pack(fill='x', pady=5)

        # Keyword Search
        tk.Label(filter_frame, text="Keyword Search:", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=0, column=0, padx=5, pady=5)
        self.search_keyword_var = tk.StringVar()
        tk.Entry(filter_frame, textvariable=self.search_keyword_var, font=('Inter', 10), width=20).grid(row=0, column=1, padx=5, pady=5)

        # Type Filter
        tk.Label(filter_frame, text="Type:", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=0, column=2, padx=5, pady=5)
        self.filter_type_var = tk.StringVar(value="All")
        ttk.Combobox(filter_frame, textvariable=self.filter_type_var, values=["All", "Text", "Audio", "Video", "Call"], state="readonly", font=('Inter', 10), width=10).grid(row=0, column=3, padx=5, pady=5)

        # Date Range Filter
        tk.Label(filter_frame, text="Date Range (Min/Max):", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=1, column=0, padx=5, pady=5)
        self.filter_date_min = tk.Entry(filter_frame, font=('Inter', 10), width=10)
        self.filter_date_min.grid(row=1, column=1, sticky='w', padx=5, pady=5)
        self.filter_date_max = tk.Entry(filter_frame, font=('Inter', 10), width=10)
        self.filter_date_max.grid(row=1, column=1, sticky='e', padx=5, pady=5)

        # Gender Filter
        tk.Label(filter_frame, text="Sender Gender:", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=1, column=2, padx=5, pady=5)
        self.filter_gender_var = tk.StringVar(value="All")
        ttk.Combobox(filter_frame, textvariable=self.filter_gender_var, values=["All", "M", "F", "O"], state="readonly", font=('Inter', 10), width=10).grid(row=1, column=3, padx=5, pady=5)

        # Length/Duration Filter
        tk.Label(filter_frame, text="Min Length/Duration:", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=2, column=0, padx=5, pady=5)
        self.filter_length_min = tk.Entry(filter_frame, font=('Inter', 10), width=10)
        self.filter_length_min.grid(row=2, column=1, sticky='w', padx=5, pady=5)

        # Suspicious Flag Filter
        tk.Label(filter_frame, text="Suspicious Flag:", font=('Inter', 10, 'bold'), bg='#ffffff').grid(row=2, column=2, padx=5, pady=5)
        self.filter_suspicious_var = tk.StringVar(value="All")
        ttk.Combobox(filter_frame, textvariable=self.filter_suspicious_var, values=["All", "Suspicious", "Normal"], state="readonly", font=('Inter', 10), width=10).grid(row=2, column=3, padx=5, pady=5)

        # Apply Filter Button
        apply_btn = tk.Button(filter_frame, text="Apply Filters", command=self.populate_logs_treeview, bg='#3b82f6', fg='white', font=('Inter', 10, 'bold'), padx=10, relief=tk.FLAT)
        apply_btn.grid(row=0, column=4, rowspan=3, padx=15, pady=5, sticky='ns')

        # 2. Log Display (Treeview)
        columns = ("ID", "Type", "Sender", "Receiver", "Date", "Time", "Content/Duration", "Suspicious")
        self.logs_tree = ttk.Treeview(log_view_frame, columns=columns, show='headings')
        self.logs_tree.pack(fill='both', expand=True, pady=10)

        for col in columns:
            self.logs_tree.heading(col, text=col, anchor='center')
            self.logs_tree.column(col, anchor='center', width=100)
        
        self.logs_tree.column("ID", width=50) # Keep ID shorter
        self.logs_tree.column("Content/Duration", width=250, anchor='w')

        # 3. Actions (Remove Data)
        action_frame = tk.Frame(log_view_frame, bg='#f0f4f8')
        action_frame.pack(fill='x', pady=5)

        tk.Label(action_frame, text="Remove Log Entry:", font=('Inter', 10, 'bold'), bg='#f0f4f8').pack(side=tk.LEFT, padx=5)
        self.remove_id_entry = tk.Entry(action_frame, font=('Inter', 10), width=40)
        self.remove_id_entry.pack(side=tk.LEFT, padx=5)
        remove_btn = tk.Button(action_frame, text="Remove Selected", command=self.remove_selected_log, bg='#ef4444', fg='white', font=('Inter', 10, 'bold'), padx=10, relief=tk.FLAT)
        remove_btn.pack(side=tk.LEFT, padx=10)

        # Context menu for right-click to view full content
        self.logs_tree.bind("<Button-3>", self.show_context_menu)
        self.logs_tree.bind("<<TreeviewSelect>>", self.on_tree_select)

    def on_tree_select(self, event):
        """Copies the ID of the selected item to the removal field."""
        selected_item = self.logs_tree.focus()
        if selected_item:
            item_id = self.logs_tree.item(selected_item, 'values')[0]
            self.remove_id_entry.delete(0, tk.END)
            self.remove_id_entry.insert(0, item_id)

    def show_context_menu(self, event):
        """Displays a context menu on right-click to view full content."""
        item = self.logs_tree.identify_row(event.y)
        if item:
            self.logs_tree.selection_set(item)
            content_value = self.logs_tree.item(item, 'values')[6]
            
            menu = tk.Menu(self.master, tearoff=0)
            menu.add_command(label=f"Full Content/File: {content_value}", command=lambda: messagebox.showinfo("Full Content", content_value))
            menu.tk_popup(event.x_root, event.y_root)

    def populate_logs_treeview(self):
        """Applies filters and updates the Treeview display."""
        for item in self.logs_tree.get_children():
            self.logs_tree.delete(item)
        
        filtered_logs = self.logs
        keyword = self.search_keyword_var.get().lower()
        log_type = self.filter_type_var.get()
        date_min_str = self.filter_date_min.get()
        date_max_str = self.filter_date_max.get()
        gender = self.filter_gender_var.get()
        min_length_str = self.filter_length_min.get()
        suspicious_flag = self.filter_suspicious_var.get()

        try:
            min_length = int(min_length_str) if min_length_str else -1
        except ValueError:
            messagebox.showerror("Filter Error", "Min Length/Duration must be a number.")
            return

        for log in self.logs:
            keep = True
            log_content = str(log.get('content_or_duration', '')).lower()
            
            # Note: log_date is now DD-MM-YYYY in the stored data
            log_date = log.get('date', '01-01-1900') 

            # 1. Keyword Search
            if keyword and keyword not in log_content and keyword not in log.get('sender_name', '').lower() and keyword not in log.get('receiver_name', '').lower():
                keep = False

            # 2. Type Filter
            if log_type != "All" and log.get('type') != log_type:
                keep = False

            # 3. Date Range Filter (Requires YYYY-MM-DD for comparison, so we convert)
            if date_min_str or date_max_str:
                try:
                    # Convert stored DD-MM-YYYY to comparable YYYYMMDD string
                    log_date_dt = datetime.strptime(log_date, "%d-%m-%Y")
                    log_date_comparable = log_date_dt.strftime("%Y%m%d")
                    
                    if date_min_str:
                         min_dt = datetime.strptime(date_min_str, "%Y-%m-%d").strftime("%Y%m%d")
                         if log_date_comparable < min_dt:
                             keep = False
                    
                    if date_max_str:
                         max_dt = datetime.strptime(date_max_str, "%Y-%m-%d").strftime("%Y%m%d")
                         if log_date_comparable > max_dt:
                             keep = False
                except ValueError:
                    # If filter dates are badly formatted (still expecting YYYY-MM-DD in the filter input fields)
                    pass


            # 4. Gender Filter (Checks if *sender* matches the gender)
            if gender != "All" and log.get('sender_gender') != gender:
                keep = False
            
            # 5. Length/Duration Filter
            try:
                length = int(log_content) if log.get('type') in ["Call"] and log_content.isdigit() else len(log_content)
                if min_length > 0 and length < min_length:
                    keep = False
            except ValueError:
                # If content is non-numeric when expected to be, or other error, skip length check
                pass

            # 6. Suspicious Flag Filter
            is_susp = log.get('is_suspicious', False)
            if suspicious_flag == "Suspicious" and not is_susp:
                keep = False
            if suspicious_flag == "Normal" and is_susp:
                keep = False

            if keep:
                tag = 'suspicious' if is_susp else ''
                # Custom tags for suspicious entries
                self.logs_tree.tag_configure('suspicious', background='#fee2e2', foreground='#ef4444', font=('Inter', 10, 'bold'))
                
                self.logs_tree.insert("", "end", values=(
                    log['id'], log['type'], 
                    f"{log['sender_name']} ({log['sender_gender']})", 
                    f"{log['receiver_name']} ({log['receiver_gender']})", 
                    log['date'], log['time'], 
                    log['content_or_duration'][:50] + "..." if len(log['content_or_duration']) > 50 else log['content_or_duration'], 
                    "YES" if is_susp else "NO"
                ), tags=(tag,))

    def remove_selected_log(self):
        """Removes the log entry with the ID from the removal entry field."""
        if not self.check_access("remove_logs"):
            return

        item_id = self.remove_id_entry.get().strip()
        if not item_id:
            messagebox.showerror("Error", "Please enter or select a Log ID to remove.")
            return

        if not messagebox.askyesno("Confirm Deletion", f"Are you sure you want to delete log entry ID: {item_id}?"):
            return

        initial_len = len(self.logs)
        self.logs = [log for log in self.logs if log['id'] != item_id]

        if len(self.logs) < initial_len:
            save_data(LOGS_FILE, self.logs)
            self.populate_logs_treeview()
            self.remove_id_entry.delete(0, tk.END)
            self.log_action(f"Removed log entry with ID: {item_id}")
            messagebox.showinfo("Success", f"Log ID {item_id} removed.")
        else:
            messagebox.showerror("Error", f"Log ID {item_id} not found.")


    # --- Tab 3: Admin Logs (Access History) ---

    def setup_admin_logs_tab(self):
        """Sets up the frame for viewing access and action history."""
        admin_log_frame = tk.Frame(self.notebook, bg='#ffffff', padx=10, pady=10)
        self.notebook.add(admin_log_frame, text="Admin/Access History")

        # 1. Log Display (Treeview)
        columns = ("Timestamp", "User", "Action Description")
        self.access_tree = ttk.Treeview(admin_log_frame, columns=columns, show='headings')
        self.access_tree.pack(fill='both', expand=True, pady=10)

        for col in columns:
            self.access_tree.heading(col, text=col, anchor='w')
            self.access_tree.column(col, anchor='w', width=150)
        self.access_tree.column("Action Description", width=500)

        self.populate_access_treeview()

        # 2. Refresh Button
        refresh_btn = tk.Button(admin_log_frame, text="Refresh Logs", command=self.populate_access_treeview, bg='#f59e0b', fg='white', font=('Inter', 10, 'bold'), padx=10, relief=tk.FLAT)
        refresh_btn.pack(pady=10)

    def populate_access_treeview(self):
        """Updates the Access History Treeview display."""
        # Reload to ensure latest actions are shown
        self.access_history = load_data(ACCESS_LOG_FILE, default_data=[]) 

        for item in self.access_tree.get_children():
            self.access_tree.delete(item)
        
        for log in reversed(self.access_history): # Show newest first
            self.access_tree.insert("", "end", values=(
                log.get('timestamp', 'N/A'), 
                log.get('user', 'N/A'), 
                log.get('action', 'N/A')
            ))
            
    # --- Tab 4: User Management (Admin Only) ---
    
    def setup_user_management_tab(self):
        """Sets up the frame for adding new users (Admin only)."""
        user_manage_frame = tk.Frame(self.notebook, bg='#ffffff', padx=20, pady=20)
        self.notebook.add(user_manage_frame, text="User Management")

        tk.Label(user_manage_frame, text="Add New System User", font=('Inter', 14, 'bold'), bg='#ffffff', fg='#1f2937').pack(pady=10)

        add_user_btn = tk.Button(user_manage_frame, text="Open User Creation Dialog", command=self.show_add_user_dialog, bg='#3b82f6', fg='white', font=('Inter', 12, 'bold'), padx=20, pady=10, relief=tk.FLAT, activebackground='#2563eb')
        add_user_btn.pack(pady=20)

    def show_add_user_dialog(self):
        """Creates a Toplevel window for admin to add a new user."""
        
        new_user_window = tk.Toplevel(self.master)
        new_user_window.title("Add New User (Admin Verification Required)")
        new_user_window.geometry("450x400")
        new_user_window.transient(self.master)
        new_user_window.grab_set()
        
        frame = tk.Frame(new_user_window, padx=20, pady=20)
        frame.pack(expand=True, fill='both')

        tk.Label(frame, text="Admin Credentials for Verification", font=('Inter', 12, 'underline')).grid(row=0, column=0, columnspan=2, pady=(0, 10))

        # Admin Verification Fields
        tk.Label(frame, text="Admin Username:").grid(row=1, column=0, sticky='w', pady=5)
        admin_user_entry = tk.Entry(frame, width=30)
        admin_user_entry.grid(row=1, column=1, padx=5, pady=5)

        tk.Label(frame, text="Admin Password:").grid(row=2, column=0, sticky='w', pady=5)
        admin_pass_entry = tk.Entry(frame, show='*', width=30)
        admin_pass_entry.grid(row=2, column=1, padx=5, pady=5)
        
        tk.Label(frame, text="--- New User Details ---", font=('Inter', 12, 'underline')).grid(row=3, column=0, columnspan=2, pady=(15, 10))

        # New User Fields
        tk.Label(frame, text="New Username:").grid(row=4, column=0, sticky='w', pady=5)
        new_user_entry = tk.Entry(frame, width=30)
        new_user_entry.grid(row=4, column=1, padx=5, pady=5)

        tk.Label(frame, text="New Password:").grid(row=5, column=0, sticky='w', pady=5)
        new_pass_entry = tk.Entry(frame, show='*', width=30)
        new_pass_entry.grid(row=5, column=1, padx=5, pady=5)

        tk.Label(frame, text="User Role:").grid(row=6, column=0, sticky='w', pady=5)
        new_role_var = tk.StringVar(value="user")
        ttk.Combobox(frame, textvariable=new_role_var, values=["user", "admin"], state="readonly", width=27).grid(row=6, column=1, padx=5, pady=5)
        
        # Function to handle submission
        def submit_new_user():
            admin_user = admin_user_entry.get().strip()
            admin_pass = admin_pass_entry.get().strip()
            new_user = new_user_entry.get().strip()
            new_pass = new_pass_entry.get().strip()
            new_role = new_role_var.get()

            # 1. Verify Admin Credentials (Must be an Admin using the dictionary structure)
            admin_info = self.users.get(admin_user)
            is_admin_valid = isinstance(admin_info, dict) and admin_info.get('password') == admin_pass and admin_info.get('role') == 'admin'

            if not is_admin_valid:
                messagebox.showerror("Authentication Error", "Invalid Admin credentials or insufficient privileges. Only full Administrators can create new users.")
                self.log_action(f"Failed attempt to add new user by admin credentials: {admin_user}")
                return

            # 2. Basic New User Validation
            if not new_user or not new_pass:
                messagebox.showerror("Validation Error", "New username and password cannot be empty.")
                return
            if new_user in self.users:
                messagebox.showerror("Validation Error", f"Username '{new_user}' already exists.")
                return

            # 3. Define Restrictions based on role
            restrictions = []
            if new_role == "user":
                # Default restrictions for non-admin users
                restrictions = ["admin_logs", "user_management", "remove_logs"]

            # 4. Save New User
            self.users[new_user] = {
                "password": new_pass,
                "role": new_role,
                "restrictions": restrictions
            }
            save_data(USERS_FILE, self.users)
            self.log_action(f"Admin '{admin_user}' added new user: {new_user} with role: {new_role}")
            
            messagebox.showinfo("Success", f"User '{new_user}' added successfully with role '{new_role}'.")
            new_user_window.destroy()

        # Submit Button
        submit_btn = tk.Button(frame, text="Create User", command=submit_new_user, bg='#10b981', fg='white', font=('Inter', 10, 'bold'), relief=tk.FLAT)
        submit_btn.grid(row=7, column=0, columnspan=2, pady=15)


# --- Program Entry Point ---

if __name__ == "__main__":
    # Initialize default user credentials if the file doesn't exist
    if not os.path.exists(USERS_FILE):
        save_data(USERS_FILE, DEFAULT_USER_DATA)
        print(f"Initial user credentials created: {USERS_FILE}")
        print("Default users: admin/password123 (admin), analyst/secure456 (restricted user)")

    root = tk.Tk()
    app = LogAnalyzerApp(root)
    root.mainloop()
