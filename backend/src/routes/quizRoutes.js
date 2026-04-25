import express from "express";
import { authRequired } from "../middleware/auth.js";
import { User } from "../models/User.js";
import { QuizResult } from "../models/QuizResult.js";

const router = express.Router();


const QUIZZES = [
  {
    id: "fire-safety-101",
    title: "Fire Safety Essentials",
    moduleId: "fire-basics",
    questions: [
      { id: "fs1", text: "Smoke is filling the room. Where is the air cleanest?", options: ["Near the ceiling", "Near the floor", "In the corners", "By the windows"], correctIndex: 1 },
      { id: "fs2", text: "You touch a door handle and it feels hot. What should you do?", options: ["Open it slowly", "Kick it open", "Do not open it; find another exit", "Pour water on it"], correctIndex: 2 },
      { id: "fs3", text: "If your clothes catch fire, what is the best immediate action?", options: ["Run to the bathroom", "Stop, Drop, and Roll", "Take them off quickly", "Fan the flames"], correctIndex: 1 },
      { id: "fs4", text: "What is the first priority when you discover a small fire?", options: ["Try to extinguish it", "Call your family", "Raise the alarm and evacuate", "Salvage valuables"], correctIndex: 2 },
      { id: "fs5", text: "You smell gas in your kitchen. What should you AVOID doing?", options: ["Opening windows", "Leaving the house", "Turning on a light switch", "Turning off the gas valve"], correctIndex: 2 },
      { id: "fs6", text: "A fire starts inside your microwave. What is the safest response?", options: ["Open door and throw water", "Keep door closed and unplug it if safe", "Use a metal spoon to stop it", "Run out without doing anything"], correctIndex: 1 },
      { id: "fs7", text: "How often should you test your home smoke alarms?", options: ["Every year", "Every month", "Every day", "Never"], correctIndex: 1 },
      { id: "fs8", text: "A grease fire starts on the stove. How do you stop it?", options: ["Throw water on it", "Use a wet towel", "Cover with a metal lid and turn off heat", "Blow on it"], correctIndex: 2 },
      { id: "fs9", text: "In a high-rise building fire, which exit route is safest?", options: ["The elevator", "The roof", "The stairs", "Jump from balcony"], correctIndex: 2 },
      { id: "fs10", text: "Why is it important to have a designated meeting point outside?", options: ["To discuss the fire", "To ensure everyone is accounted for", "To wait for neighbors", "To watch the fire engines"], correctIndex: 1 }
    ]
  },
  {
    id: "fire-suppression-advanced",
    title: "Fire Suppression Mastery",
    moduleId: "fire-advanced-suppression",
    questions: [
      { id: "fsa1", text: "What type of fuel is involved in a Class A fire?", options: ["Cooking oils", "Flammable liquids", "Ordinary combustibles (wood, paper)", "Metals"], correctIndex: 2 },
      { id: "fsa2", text: "Class K fire extinguishers are specifically designed for:", options: ["Kitchen fires (oils/fats)", "Electrical fires", "Wood fires", "Chemical fires"], correctIndex: 0 },
      { id: "fsa3", text: "A CO2 extinguisher is safe to use on:", options: ["Class A fires only", "Electrical and flammable liquid fires", "Wood and paper fires", "Metal fires"], correctIndex: 1 },
      { id: "fsa4", text: "In the P.A.S.S. technique, what does the 'P' stand for?", options: ["Push the lever", "Point the nozzle", "Pull the pin", "Press the button"], correctIndex: 2 },
      { id: "fsa5", text: "In the P.A.S.S. technique, where should you aim the nozzle ('A')?", options: ["At the top of the flames", "At the middle of the fire", "At the base of the fire", "Into the smoke"], correctIndex: 2 },
      { id: "fsa6", text: "In the P.A.S.S. technique, what is the first 'S'?", options: ["Stop moving", "Squeeze the handle", "Sweep side to side", "Stand back"], correctIndex: 1 },
      { id: "fsa7", text: "In the P.A.S.S. technique, what is the second 'S'?", options: ["Stay inside", "Search for help", "Sweep from side to side", "Squeeze again"], correctIndex: 2 },
      { id: "fsa8", text: "When should you NOT use water on a fire?", options: ["Wood fire", "Paper fire", "Electrical or grease fire", "Cloth fire"], correctIndex: 2 },
      { id: "fsa9", text: "How far back should you stand when using a fire extinguisher?", options: ["1-2 feet", "6-8 feet", "15-20 feet", "Next to the flames"], correctIndex: 1 },
      { id: "fsa10", text: "If the fire starts to spread after using an extinguisher:", options: ["Keep trying", "Find another extinguisher", "Evacuate immediately", "Refill the extinguisher"], correctIndex: 2 }
    ]
  },
  {
    id: "earthquake-res-101",
    title: "Earthquake Survival",
    moduleId: "earthquake-drop-cover-hold",
    questions: [
      { id: "eq1", text: "If you are indoors during an earthquake, the best action is:", options: ["Run outside", "Drop, Cover, and Hold on", "Stand in a doorway", "Hide in a closet"], correctIndex: 1 },
      { id: "eq2", text: "During a quake, if you are near a sturdy table, you should:", options: ["Sit on top of it", "Move it to the door", "Get under it and hold on", "Move away from it"], correctIndex: 2 },
      { id: "eq3", text: "If you are in bed when an earthquake starts:", options: ["Run to the kitchen", "Get under the bed", "Stay there and protect head with pillow", "Stand in the middle of room"], correctIndex: 2 },
      { id: "eq4", text: "If you are outdoors when the shaking begins:", options: ["Run into a building", "Move to an open area away from buildings", "Climb a tree", "Stand under a power line"], correctIndex: 1 },
      { id: "eq5", text: "While driving during an earthquake, you should:", options: ["Speed up to get away", "Stop in the middle of a bridge", "Pull over to a clear area and stay inside", "Exit the car immediately"], correctIndex: 2 },
      { id: "eq6", text: "What should you expect after the initial shaking stops?", options: ["The earthquake is over", "Heavy rains", "Aftershocks", "Immediate power restoration"], correctIndex: 2 },
      { id: "eq7", text: "If you smell gas after an earthquake:", options: ["Light a match to see where it is", "Turn on all lights", "Turn off the main gas valve if safe", "Ignore it"], correctIndex: 2 },
      { id: "eq8", text: "If you are trapped under debris, how should you signal for help?", options: ["Shout continuously (to save air)", "Tap on a pipe or wall", "Keep quiet and wait", "Try to move the debris"], correctIndex: 1 },
      { id: "eq9", text: "Which method of exit should be avoided after a large quake?", options: ["Stairs", "Emergency exits", "Elevators", "Windows"], correctIndex: 2 },
      { id: "eq10", text: "If you are near the coast during a large quake, you must:", options: ["Stay on the beach", "Watch the waves", "Move to higher ground immediately", "Go into the water"], correctIndex: 2 }
    ]
  },
  {
    id: "flood-evac-pro",
    title: "Flood Evacuation Pro",
    moduleId: "flood-evacuation-routes",
    questions: [
      { id: "fl1", text: "What should you do upon hearing a Flash Flood Warning?", options: ["Wait for more data", "Check your basement", "Move to higher ground immediately", "Secure your windows"], correctIndex: 2 },
      { id: "fl2", text: "If you encounter a flooded road while driving:", options: ["Drive through quickly", "Measure depth with a stick", "Turn around, don't drown", "Follow the car in front"], correctIndex: 2 },
      { id: "fl3", text: "Why is standing water dangerous near power lines?", options: ["The water might be deep", "Risk of electrocution", "The water is slippery", "It blocks traffic"], correctIndex: 1 },
      { id: "fl4", text: "Flash floods can occur even if it isn't raining near you.", options: ["True", "False"], correctIndex: 0 },
      { id: "fl5", text: "Which of these is most important in a disaster kit?", options: ["Video games", "Clean water (1 gallon per person/day)", "Excess clothing", "Luxury items"], correctIndex: 1 },
      { id: "fl6", text: "Just 6 inches of fast-moving water can:", options: ["Do nothing", "Knock over an adult", "Reach the bottom of most cars and cause stall", "Both 1 and 2"], correctIndex: 2 },
      { id: "fl7", text: "How much moving water can sweep away most vehicles?", options: ["6 inches", "12-24 inches", "5 feet", "10 feet"], correctIndex: 1 },
      { id: "fl8", text: "If you are ordered to evacuate, you should:", options: ["Stay and protect property", "Request a second opinion", "Leave immediately via recommended routes", "Wait until the water reaches your door"], correctIndex: 2 },
      { id: "fl9", text: "When is it safe to return to a flooded home?", options: ["As soon as it stops raining", "When the water starts receding", "Only when local authorities declare it safe", "After 24 hours"], correctIndex: 2 },
      { id: "fl10", text: "When cleaning up after a flood, you should wear:", options: ["Normal clothes", "Swimsuit", "Protective gear (gloves, boots, mask)", "Flip-flops"], correctIndex: 2 }
    ]
  }
];

router.get("/", authRequired, async (req, res, next) => {
  try {
    const safe = QUIZZES.map((q) => ({
      id: q.id,
      title: q.title,
      moduleId: q.moduleId,
      count: q.questions.length,
      questions: q.questions.map((qn) => ({
        id: qn.id,
        text: qn.text,
        options: qn.options
      }))
    }));
    return res.json({ ok: true, quizzes: safe });
  } catch (err) {
    next(err);
  }
});

router.post("/:quizId/submit", authRequired, async (req, res, next) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body || {};
    const userId = req.user.sub;

    const quiz = QUIZZES.find((q) => q.id === quizId);
    if (!quiz) return res.status(404).json({ ok: false, message: "Quiz not found" });

    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (Number(answers[q.id]) === q.correctIndex) {
        correctCount++;
      }
    });

    const total = quiz.questions.length;
    const scorePct = Math.round((correctCount / total) * 100);
    const pointsAwarded = correctCount * 10;
    
    let feedback = "Needs Improvement";
    if (scorePct >= 90) feedback = "Excellent! You are a Pro!";
    else if (scorePct >= 70) feedback = "Good Job! Keep practicing.";
    else if (scorePct >= 40) feedback = "Decent. Refresh your knowledge.";

    const badge = scorePct >= 80 ? `${quiz.title} Specialist` : null;

    const user = await User.findByIdAndUpdate(userId, { 
      $inc: { points: pointsAwarded },
      $addToSet: { badges: badge ? badge : undefined }
    }, { new: true });

    const result = {
      correct: correctCount,
      total,
      scorePct,
      pointsAwarded,
      feedback,
      badgeEarned: badge,
      correctAnswers: quiz.questions.reduce((acc, q) => {
        acc[q.id] = q.correctIndex;
        return acc;
      }, {})
    };

    // Save result to DB
    await QuizResult.create({
      student: userId,
      quizId,
      title: quiz.title,
      score: scorePct,
      totalQuestions: total,
      pointsAwarded
    });

    return res.json({ ok: true, result });

  } catch (err) {
    next(err);
  }
});


export default router;
