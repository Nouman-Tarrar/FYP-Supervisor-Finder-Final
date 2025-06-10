-- Documentation Structure:

1-Component & Context Guides
   AppContext: Provides user and role info
   PrivateRoute: Protects routes based on authentication and role
   Pages & Views: Login, Signup, BrowseSupervisors, FacultyManagement, etc.

2-Data Model & Collections
   users: Stores UID, email, role ("student" or "admin")
   faculty: Documents for each supervisor (name, domain, slots, officeHours, pictureURL)
   students: Tracks selectedSupervisorID per student
   submissions: Project ideas and statuses submitted by students

3-User Flows
   Admin: Add/Edit/Delete faculty records
   Student: Browse, filter, select/unselect supervisor, submit idea


-- How CRUD Works:

1-Create
   Faculty: Admin portal uses addDoc(collection(db, "faculty"), {...}) to add new supervisors.
   Student Selection: setDoc(doc(db, "students", uid), { selectedSupervisorID: id }, { merge: true }) reserves a supervisor.
   Submission: After selection, students use addDoc or setDoc in the submissions collection to submit project idea.

2-Read
   Faculty List: Both portals use onSnapshot(collection(db, "faculty"), callback) to stream real-time lists.
   Student Data: getDoc(doc(db, "students", uid)) to retrieve selection status, getDoc on submissions for submission checks.

3-Update
   Faculty Fields: Admin edits domain, slots, officeHours, pictureURL via updateDoc(doc(db, "faculty", id), { field: value }).
   Unselect Supervisor: Students call setDoc(..., { selectedSupervisorID: null }, { merge: true }) to clear reservation.

4-Delete
   Faculty Records: Admins remove supervisors with deleteDoc(doc(db, "faculty", id)).

-- Role Management:

1-Student
   Default role upon signup.
   Access to BrowseSupervisors and Submission pages.
   Restricted from faculty management routes.

 2-Admin (Faculty Manager)
   Role manually assigned in the users collection (e.g., by setting role: "admin").
   Access to FacultyManagement page for CRUD on faculty.
   Cannot browse or reserve supervisors.

-- Deployed Link:

fyp-supervisor-finder-44bce.firebaseapp.com

fyp-supervisor-finder-44bce.web.app

-- Features

👨‍🎓 Student Portal

**Browse Supervisors**: View faculty members with details like domain, slots available, office hours, and profile photo.
**Select Supervisor**: Students can select one available supervisor (if slots remain).
**Track Project Progress**: View FYP submission steps, revisions, deadlines, and progress via a visual stepper UI.

👨‍🏫 Admin/Faculty Portal

**Faculty Management**:
  - Add, update, or delete faculty records.
  - Fields include: Name, Email, Domain, Office Hours, Slots, and Profile Picture URL.
**Student Management** *(optional/expandable)*:
  - View selected supervisors.
  - Monitor student project status.
  
🔐 Authentication

- Google Sign-In  
- Email/Password Sign-Up & Login  
- Role-based protected routes using React Context

