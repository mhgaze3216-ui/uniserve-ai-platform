const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Course = require('../models/Course');
require('dotenv').config();

const seedData = async () => {
  try {
    const config = require('../config');
    await mongoose.connect(config.mongodbUri);
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Course.deleteMany({});

    const instructorPassword = await bcrypt.hash('instructor123', 10);
    const studentPassword = await bcrypt.hash('student123', 10);

    const instructor = new User({
      username: 'instructor1',
      email: 'instructor@unser1.com',
      password: instructorPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: 'instructor',
      avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=195de6&color=fff'
    });

    const student = new User({
      username: 'student1',
      email: 'student@unser1.com',
      password: studentPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: 'student',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=22c55e&color=fff'
    });

    await instructor.save();
    await student.save();

    const courses = [
      {
        title: 'Python Programming',
        description: 'Learn Python from basics to advanced concepts including data structures, algorithms, and object-oriented programming.',
        category: 'programming',
        price: 40,
        duration: '5 weeks',
        durationWeeks: 5,
        location: 'Online',
        instructor: instructor._id,
        tags: ['python', 'programming', 'beginner'],
        image: 'python.jpg'
      },
      {
        title: 'C++ Programming',
        description: 'Master C++ programming with focus on memory management, pointers, and modern C++ features.',
        category: 'programming',
        price: 60,
        duration: '6 weeks',
        durationWeeks: 6,
        location: 'Online',
        instructor: instructor._id,
        tags: ['cpp', 'programming', 'intermediate'],
        image: 'cpp.jpg'
      },
      {
        title: 'HTML & CSS Fundamentals',
        description: 'Build responsive websites with modern HTML5 and CSS3 techniques.',
        category: 'web-development',
        price: 80,
        duration: '4 weeks',
        durationWeeks: 4,
        location: 'Online',
        instructor: instructor._id,
        tags: ['html', 'css', 'web', 'beginner'],
        image: 'html.jpg'
      },
      {
        title: 'JavaScript Mastery',
        description: 'Advanced JavaScript concepts including ES6+, async programming, and modern frameworks.',
        category: 'web-development',
        price: 75,
        duration: '4 weeks',
        durationWeeks: 4,
        location: 'Online',
        instructor: instructor._id,
        tags: ['javascript', 'web', 'advanced'],
        image: 'javascript.jpg'
      },
      {
        title: 'English Language Course',
        description: 'Improve your English speaking, writing, and comprehension skills.',
        category: 'language',
        price: 30,
        duration: '4 weeks',
        durationWeeks: 4,
        location: 'Online',
        instructor: instructor._id,
        tags: ['english', 'language', 'communication'],
        image: 'english.jpg'
      },
      {
        title: 'Artificial Intelligence Fundamentals',
        description: 'Introduction to AI concepts, machine learning, and neural networks.',
        category: 'ai',
        price: 40,
        duration: '8 weeks',
        durationWeeks: 8,
        location: 'Online',
        instructor: instructor._id,
        tags: ['ai', 'machine-learning', 'neural-networks'],
        image: 'ai.jpg'
      },
      {
        title: 'Frontend Web Development',
        description: 'Complete frontend development with React, Vue, and modern CSS frameworks.',
        category: 'web-development',
        price: 30,
        duration: '4 weeks',
        durationWeeks: 4,
        location: 'Online',
        instructor: instructor._id,
        tags: ['frontend', 'react', 'vue', 'css'],
        image: 'frontend.jpg'
      },
      {
        title: 'Backend Web Development',
        description: 'Build scalable backend applications with Node.js, Express, and databases.',
        category: 'web-development',
        price: 40,
        duration: '5 weeks',
        durationWeeks: 5,
        location: 'Online',
        instructor: instructor._id,
        tags: ['backend', 'nodejs', 'express', 'database'],
        image: 'backend.jpg'
      }
    ];

    const createdCourses = await Course.insertMany(courses);
    console.log(`Created ${createdCourses.length} courses`);

    await student.enrolledCourses.push(...createdCourses.slice(0, 3).map(course => course._id));
    await student.save();

    console.log('Database seeded successfully!');
    console.log('Instructor login: instructor@unser1.com / instructor123');
    console.log('Student login: student@unser1.com / student123');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding error:', error);
    mongoose.connection.close();
  }
};

seedData();
