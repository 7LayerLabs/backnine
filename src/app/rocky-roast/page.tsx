"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);


const ROAST_COLLECTION = [
  `Rocky,

Someone just paid actual money — their hard-earned dollar — specifically so we'd tell you the truth about your golf game. Think about that. They saw a button that said "roast Rocky's golf" and didn't hesitate.

We've seen your swing. Calling it a "swing" is generous. It's more like you're fighting off a wasp while having a seizure. The ball doesn't know whether to go left, right, or just sit there out of pity. Most of the time it chooses pity.

Your handicap isn't a number, it's a cry for help. You line up a putt like you're solving a crime — all that focus, all that intensity — then you still miss by four feet. The hole literally cannot move, Rocky. It's right there.

You lose more balls per round than most people own. The woods aren't a hazard for you, they're a second home. Fish in the pond have named a wing of their castle after you. "The Rocky Collection" — seven Titleists and a range ball you definitely stole.

Your driver? You should just leave it in the car. Actually, leave it at the store. But no — you step up, waggle like you're about to bomb one 280, then top it 40 yards into the ladies' tee markers.

The worst part? You still show up. Every week. Same delusion. "I'm hitting them good on the range." No you're not, Rocky. The range balls are just too depressed to fly properly and you've mistaken that for progress.

See you on the course (or in the trees looking for your ball).`,

  `Rocky,

A dollar well spent. Someone wanted you to know the truth.

Your golf game is the reason golf courses have insurance. Every time you step onto the first tee, somewhere a grounds crew member whispers "here we go again" and prepares the divot repair kit. The big one.

Your pre-shot routine is longer than most movies and twice as painful to watch. All that visualization, all those practice swings, all that breathing — and then you chunk it 30 yards into a bunker you didn't even know existed. The sand trap has filed a restraining order.

Remember last week when you said you "finally figured it out"? Everyone does. You say it every week. You've "figured it out" more times than anyone in history. Each revelation lasts exactly 3 holes before whatever swing thought you had evaporates and you're back to your regularly scheduled disaster.

Your putting is genuinely offensive. You read greens like you're solving a murder mystery — pacing around, squinting, crouching down — then you still hit it six feet past the hole. The line was right there, Rocky. You just can't hit it.

Here's what's wild: you spend more on golf than some people spend on rent. The clubs, the lessons, the green fees. You've invested thousands into being aggressively mediocre. That's commitment to failure that honestly deserves some respect.

Keep swinging, champ. The trees miss you.`,

  `Rocky,

Congratulations — someone just spent money to remind you that your golf game is a violation of the sport.

You've got the confidence of a tour player and the results of someone who just picked up the game yesterday. The disconnect is fascinating. You step up to every shot like you're about to do something incredible, and then you do something incredible — incredibly bad.

Your short game isn't a game, it's a hostage situation. The ball has no idea where it's going. Neither do you. You chunk chips, blade pitches, and skull bunker shots with a consistency that's almost impressive. At least you're reliable.

The way you blame equipment is truly remarkable. New driver didn't fix it. New irons didn't fix it. New putter definitely didn't fix it. At some point you have to accept that the problem is the thing holding all those clubs — you.

Your course management is chaos theory in action. You aim left to play your slice, but then you hit it straight (for once) and you're in the woods anyway. You try to lay up and somehow end up further back. Every decision makes things worse.

The cart girl knows your drink order because you order it on every hole. That's not golf, Rocky. That's drinking with obstacles.

But hey, at least the beer is cold. Unlike your game.`,

  `Rocky,

One dollar. That's what someone paid to deliver this message. One dollar. Still more value than your last round.

Let's talk about your driver for a second. You swing that thing like you're angry at the ball personally. Like the ball insulted your family. And somehow, despite all that violence, it still only goes 180 yards — usually sideways. It's not the club, Rocky. The club is innocent.

Your "warmup" at the range should be classified as a warning sign. Thirty balls, maybe two solid contacts, and then you walk to the first tee convinced you're ready. You're not ready. You're never ready. You've never been ready.

Your score is a mystery because you stop counting somewhere around the triple bogey mark. "I think I had a 7 there." You did not have a 7 there. Everyone saw. We all counted. It was an 11.

Here's the thing about golf, Rocky: it rewards practice, patience, and humility. You have none of these things. You show up, grip it, rip it, curse, repeat. Your learning curve isn't a curve — it's a flatline.

The best part of your game is the outfit. At least you look good losing balls.

Enjoy your next round. The course won't.`,

  `Rocky,

Someone decided their dollar was best spent making sure you know exactly how bad you are at golf. They were right.

Your backswing has too many moving parts. Your downswing has too few. The whole thing looks like a software glitch in a video game. If someone tried to animate your swing, they'd get fired for making it unrealistic.

You've taken more lessons than some PGA pros gave in their careers. Each instructor said something different. You remember none of it. Or worse — you remember all of it and try to apply everything simultaneously. That's not a swing thought, that's a panic attack with a golf club.

Your ball striking is theoretically possible but rarely observed. Like Bigfoot. People claim to have seen you hit a pure iron, but there's no evidence. Just blurry memories and a lot of skepticism.

You play golf like you're being timed. Rushing to the ball, barely looking at the target, swinging before your feet are set. Nobody is rushing you, Rocky. The course isn't going anywhere. Neither is your score, but that's a different issue.

The group behind you has learned patience watching you search for balls. They should send you a thank you note. You've taught them meditation through frustration.

Same time next week?`,

  `Rocky,

A complete stranger just paid real money to have us tell you this: your golf game is an embarrassment to the sport, your playing partners, and honestly to physics itself.

You've broken more clubs in anger than you've broken par. That's not a stat to be proud of. That's a therapy bill waiting to happen. The way you slam that putter into your bag after a three-putt — everyone sees it. Everyone.

Your "go-to shot" is the worm burner. That low screaming thing that barely gets airborne and runs forever in the wrong direction. You've turned it into an art form. The ugliest art form.

Here's something nobody wants to tell you: when you say "nice shot" to yourself after something mediocre, everyone cringes. A shot that just stayed in play isn't "nice." It's the bare minimum. You're celebrating survival, not success.

Your relationship with bunkers is toxic. You keep ending up in them, they keep hurting you, and neither of you learns anything. It's the same explosion shot every time. Sand everywhere. Ball nowhere.

Remember when you blamed the course conditions? The course was fine. The course is always fine. You are the condition that needs addressing.

Keep at it, Rocky. Persistence is admirable. Results would be better, but persistence is fine too.`,

  `Rocky,

Someone paid a dollar to hurt your feelings. Money well spent.

Your follow-through looks like you're trying to swat a fly that personally wronged you. The club goes everywhere except where it should. Up, around, sideways — it's chaos with a grip.

You mark your ball on the green like it matters. Like you're protecting your position. Rocky, you're 47 feet from the hole. Nobody is going to accidentally hit your ball. You could leave a traffic cone there and it would be fine.

The way you tee up the ball is a whole production. Adjusting the height, stepping back, adjusting again. All that precision for a shot that's going to dribble off the tee anyway. The preparation doesn't match the execution. Ever.

Your bag has more gadgets than a spy movie. Rangefinder, alignment sticks, training aids. You've got technology that could put a man on the moon and you still can't break 100. The tools aren't the problem. The person using them is.

Everyone watches you address the ball and silently bets on which direction the miss is going. It's a game within your game. The only one you're good at is being unpredictable.

May your next round be slightly less embarrassing than your last.`,

  `Rocky,

This message is brought to you by someone's hard-earned dollar and your complete inability to play golf.

You've got more swing thoughts than a philosophy major. "Hips first, keep the head still, shallow the club, maintain lag, transfer weight..." By the time you've processed all that, you've already chunked it into the ground. Your brain is fighting your body and somehow they're both losing.

Your divots could be studied by archaeologists. They're deep, they're wide, and they're always in the wrong place — behind the ball, mostly. You've excavated more turf than a landscaping company. The course should charge you extra.

Remember that birdie you made three years ago? Everyone does. Because you won't stop talking about it. One birdie. Three years. That's your highlight reel. A single, solitary birdie that you've stretched into a personality trait.

Your golf posture looks like you're bracing for impact. Which, to be fair, the ball probably is too. The tension in your shoulders could crush diamonds. Relax, Rocky. It's not life or death. It just feels that way when we watch you play.

The starter sees your name on the tee sheet and sighs. That's your legacy.

Until next time.`,

  `Rocky,

A dollar was exchanged so you could read these words. That dollar had more purpose than your last round.

Your sand game is an actual crime. You enter bunkers like you're going to live there. Three shots, four shots, eventually you pick up and throw it onto the green. We've all seen it. The rake has PTSD.

You read putts like you're decoding ancient hieroglyphics. All that analysis, all that crouching and squinting, and then you hit it exactly where you were already standing. The read was right. Your stroke was wrong. Again.

Your club selection is pure fiction. "It's a smooth 7 for me." No it's not, Rocky. Nothing is smooth for you. You hit your 7-iron 140 on a good day. This is not a good day. This is never a good day.

The people behind you have aged visibly waiting for your group. They started the round young and hopeful. Now they're bitter and gray. You did that to them. Your pace of play is a human rights violation.

Your cart partner has started bringing headphones. That's not a coincidence.

Enjoy the back nine. The front nine certainly didn't enjoy you.`,

  `Rocky,

Dollar donated. Roast delivered. Your golf game remains terrible.

You stand over the ball like something important is about to happen. The reality check comes 0.8 seconds later when you thin it across the green into a bunker you didn't know was there. Surprise! There's always another bunker.

Your practice swing is beautiful. Fluid, confident, balanced. Then the actual swing happens and it's like watching someone fight a ghost. What happened between rehearsal and performance? The world may never know.

You've lost balls in places that shouldn't be possible. The middle of the fairway has somehow rejected your ball into oblivion. Cart paths have eaten shots whole. Once, a ball disappeared on the green. ON THE GREEN, ROCKY.

Your excuses are more creative than your shot-making. "The wind changed." There is no wind. "The ground was wet." It hasn't rained in two weeks. "I looked up." You always look up. That's not an excuse, that's a pattern.

The pro shop has your photo behind the counter. Not as customer of the month. As a warning.

See you at the range. Where it also won't help.`,

  `Rocky,

Someone spent actual currency to inform you that your golf game is a disgrace. Let's review why.

Your grip pressure could strangle a python. Every golf instructor has told you to relax your hands. You've heard "light grip" a thousand times. Yet here you are, white-knuckling every club like it owes you money. It doesn't. You owe it an apology.

The sounds you make during a round are inappropriate. The grunting, the sighing, the occasional scream. It's golf, not a horror movie. Although watching you play, the comparison makes sense.

You've blamed the sun, the grass, your shoes, your breakfast, and once, memorably, a butterfly. A butterfly, Rocky. It was thirty yards away. It did not affect your shot. Your incompetence affected your shot.

Your finish position after a bad shot — which is every shot — is theatrical. The club twirl that goes nowhere. The stare into the distance. The slow, disappointed head shake. You've got the reactions of a tour player without any of the actual ability.

Somewhere, a golf ball is hiding in the woods, relieved it never has to be hit by you again.

Swing easy. Miss easy. That's your motto now.`,

  `Rocky,

A whole dollar. For this. Worth every penny.

Let's talk about your relationship with water hazards. It's toxic. You're drawn to ponds like they're magnets. "I'll just aim left of the water." Cool, you've now aimed directly at the water. Every time. Without fail. The fish are organizing a protest.

Your pre-round confidence is medically fascinating. Stretching like you're about to compete at Augusta. Talking about how you've "been working on some things." Those things have not helped. The things have failed. You are thing-less.

The way you mark your scorecard is suspicious. Lots of erasing. Lots of "what did I get on that hole?" You know what you got. We all know what you got. The creative accounting isn't fooling anyone.

Your provisional ball should just be your first ball at this point. Save time. Hit two off every tee. Accept the reality. The first one is a sacrifice to the golf gods. The second one is also probably going in the woods, but at least you're prepared.

The only thing consistent about your game is the inconsistency.

May the course have mercy, because we won't.`,

  `Rocky,

Dollar spent. Truth incoming. Brace yourself.

You've bought more training aids than most stores carry. The orange whip, the alignment sticks, the putting mirror, the impact bag. Your garage looks like a golf infomercial exploded. Has any of it helped? Survey says: absolutely not.

Your reaction to a good shot is embarrassing. One decent drive and you're fist-pumping like you've won the Masters. Meanwhile, it landed in the first cut of rough 180 yards out. Calm down. You're still 230 from the green. This isn't victory. This is survival.

The way you analyze your bad shots is exhausting. "I came over the top there." Yes, you did. You do it every time. It's not a mystery. It's not a puzzle to solve. It's just who you are now.

Your attitude on the back nine versus the front nine is a case study in broken spirits. Hole 1: optimistic, chatty, full of hope. Hole 14: silent, dead-eyed, considering taking up fishing.

You've described yourself as a "bogey golfer." That's generous. That's Olympic-level generosity. You're a bogey golfer like a hurricane is a light breeze.

Keep grinding. Or don't. The result is the same.`,

  `Rocky,

Payment received. Roast in progress. Your golf game is the target.

You have the setup of someone who knows what they're doing. Feet aligned, shoulders square, eyes on the ball. And then the swing happens and it's like all that preparation was for a different sport. Cricket, maybe. Or some kind of combat.

Your mulligans have mulligans. "That one didn't count because I wasn't ready." You're never ready. If we only counted shots you were ready for, you'd never finish a round.

The sound of your club hitting the ground before the ball is basically your signature. That thud. That chunk. That explosion of grass and dirt and shattered dreams. They should name a divot pattern after you.

You've told everyone about your "breakthrough" on the range at least seventeen times. The breakthrough has not transferred to the course. The breakthrough is a lie. The range is not real golf and deep down, you know this.

Your playing partners have stopped giving advice. Not because you've improved. Because they've given up. They've accepted that you are who you are: a person who plays golf poorly and will continue to do so.

The next round will be different. It won't, but keep that dream alive.`,

  `Rocky,

One dollar, one roast, one harsh reality check.

Your tempo is chaos set to music. Fast backswing, pause at the top that lasts three business days, then a downswing that could break the sound barrier. There's no rhythm. There's no flow. It's just violence against a stationary object.

The ball watches you set up and prepares for disappointment. If golf balls could sigh, yours would never stop. They've seen things. Terrible things. Things you've done to them with what you call a "swing."

You have strong opinions about professional golfers despite shooting 40 strokes higher than them on your best day. "He should have laid up there." Should he, Rocky? Should the guy who wins millions of dollars playing golf take advice from someone who can't break 100?

Your relationship with your driver is abusive. You yell at it. You threaten to replace it. Sometimes you shove it deep into the bag like it's in timeout. The driver has done nothing wrong. The driver is innocent. You are the problem.

Every round, you say "never again." Every week, you're back. It's addiction without any of the enjoyment.

See you on the first tee. Same time. Same disaster.`,

  `Rocky,

Funded by a well-wisher. "Well-wisher" might be generous. Let's proceed.

Your golf shoes are immaculate. Your glove is fresh. Your outfit is coordinated. You look like a golfer. The costume is perfect. And then you swing and the whole illusion shatters into a million pieces, kind of like your scorecard.

You've played this course a hundred times and still don't know where the hazards are. "Oh, there's water there?" Yes, Rocky. There's been water there every single time you've played. It's not new. The water didn't just show up. Your memory has simply refused to record this information.

Your playing partners have a group chat you're not in. It's called "Rocky Stories." Every week, new content. The chat is thriving. Your golf game provides endless entertainment for everyone except you.

The starter asks how long you've been playing. Not to make conversation. To warn the groups behind you. To prepare them emotionally for what's about to happen to their pace of play.

You've considered lessons. You've "looked into it." You've read articles. You've watched videos. Application remains theoretical. Your golf game remains identical to five years ago. Growth is optional and you've opted out.

May your balls fly straight. They won't, but may they.`,

  `Rocky,

A dollar was sacrificed at the altar of truth. Here's what it bought:

You address the ball with the intensity of a surgeon. Hands just so. Feet precisely positioned. One last waggle for good measure. Then you swing and it looks like you're trying to murder the ball rather than hit it. The ball, understandably, panics and goes anywhere but straight.

Your "good miss" is other people's disaster. "At least I can find it" — yes, you can find it in the adjacent fairway, in someone's backyard, or embedded in a tree. Findable is a low bar you still struggle to clear.

The mental game? Nonexistent. One bad shot and you're spiraling. Two bad shots and you're considering quitting. Three bad shots — which happens by hole 2 — and you've mentally checked out for the rest of the round while still somehow complaining constantly.

You putt like you're afraid the ball might bite you. Deceleration on every stroke. The ball barely reaches the hole. "Died in the jaws" implies it had any speed at all. It didn't. It limped. It crawled. It begged for mercy.

The beverage cart is your only source of joy out there. And honestly? Same.

May your next round bring peace. Or at least alcohol.`,

  `Rocky,

Someone's dollar. Your suffering. Balance in the universe.

Your club selection process involves asking everyone in a 50-yard radius what they're hitting. "What'd you hit there?" "What club you got?" Then you ignore all advice and pull something completely different anyway. Why ask? We'll never know.

You've had the same swing flaws for a decade. Not because they're unfixable. Because fixing them would require admitting they exist. And you've built an elaborate denial system where every bad shot is a one-time anomaly. It's not. It's every time. It's the pattern, not the exception.

Your ball marks on the green look like meteor impacts. The ball doesn't land so much as crater. Pitch marks the size of dinner plates. The greenskeeper has a photo of you on their dartboard.

The optimism you display on the first tee is medically concerning. "I feel good about today." You felt good last week too. And the week before. The feeling is unconnected to any evidence or reality. It's pure, delusional hope. Almost impressive, if it wasn't so sad.

You've nicknamed your clubs. They don't deserve names. They've done nothing to earn such affection. They're accomplices to your crimes against golf.

Until next time, which will be exactly like this time.`,

  `Rocky,

Roast purchased. Roast delivered. No refunds on either.

You line up your drive like a sniper lining up a shot. Precise. Focused. Deadly serious. Then you pull the trigger and the ball goes sideways like even it is confused about what just happened. The sniper missed. The sniper always misses.

Your handicap is a work of fiction. A creative writing exercise. Fantasy sports, but make it delusional. The number you tell people and the scores you actually shoot exist in different dimensions.

Every round includes at least one "I usually hit that club so well." No you don't, Rocky. There is no club you hit well. That's not a thing that happens. Your relationship with every club is one of mutual disappointment.

You've described your miss as "a little fade." That wasn't a fade. That was a slice. A violent, uncontrollable slice. A fade is intentional. What you did was surrender control of the ball to forces beyond comprehension.

The course marshal has your cart number memorized. Not for service purposes. For surveillance. You're on a watch list of slow players. Congratulations on this achievement.

Same time next week? Of course. The addiction continues.`,
];

// Get a random roast for display
const getRandomRoast = () => ROAST_COLLECTION[Math.floor(Math.random() * ROAST_COLLECTION.length)];

export default function RockyRoastPage() {
  const [roastType, setRoastType] = useState<"custom" | "default">("default");
  const [customRoast, setCustomRoast] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Initialize with a random roast immediately
  const [selectedRoast, setSelectedRoast] = useState(() =>
    ROAST_COLLECTION[Math.floor(Math.random() * ROAST_COLLECTION.length)]
  );

  // Re-randomize on every page load/refresh
  useEffect(() => {
    setSelectedRoast(ROAST_COLLECTION[Math.floor(Math.random() * ROAST_COLLECTION.length)]);
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);

    try {
      const roastMessage = roastType === "custom" ? customRoast : selectedRoast;

      if (roastType === "custom" && customRoast.trim().length < 10) {
        alert("Come on, put some effort into it! Write at least a few sentences.");
        setIsLoading(false);
        return;
      }

      const response = await fetch("/api/checkout/rocky-roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roastMessage }),
      });

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* Header */}
      <header className="border-b border-stone-800">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-semibold text-white hover:text-stone-300 transition-colors">
            ← Back Nine Apparel
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Roast Rocky&apos;s Golf Game
          </h1>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            For just <span className="text-green-500 font-bold">$1</span>, we&apos;ll send Rocky an email absolutely destroying his golf game. He&apos;ll never know who sent it. Pure chaos.
          </p>
        </div>

        {/* Who is Rocky */}
        <div className="bg-stone-900 rounded-xl p-6 mb-8 border border-stone-800">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-40 h-40 md:w-48 md:h-48 relative flex-shrink-0 rounded-xl overflow-hidden">
              <Image
                src="/apparel/marketing/rockygolf.png"
                alt="Rocky on the golf course"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2 text-stone-300">Who is Rocky?</h2>
              <p className="text-stone-400">
                Rocky thinks he can play golf. He cannot. He&apos;s lost more balls than he&apos;s found, his swing looks like a crime scene, and he still shows up every week convinced &quot;today&apos;s the day.&quot; It&apos;s not. The only thing good about his golf game is his apparel, thanks to Back Nine. Help us remind him.
              </p>
            </div>
          </div>
        </div>

        {/* Roast Options */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold">Choose Your Weapon</h2>

          {/* Option 1: Default Roast */}
          <div
            onClick={() => setRoastType("default")}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              roastType === "default"
                ? "border-green-500 bg-stone-900"
                : "border-stone-700 bg-stone-900/50 hover:border-stone-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  roastType === "default" ? "border-green-500" : "border-stone-600"
                }`}
              >
                {roastType === "default" && (
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Use Our Premium Roast</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Get a different roast than current one
                      let newRoast = selectedRoast;
                      while (newRoast === selectedRoast && ROAST_COLLECTION.length > 1) {
                        newRoast = ROAST_COLLECTION[Math.floor(Math.random() * ROAST_COLLECTION.length)];
                      }
                      setSelectedRoast(newRoast);
                    }}
                    className="text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-3 py-1 rounded-full transition-colors"
                  >
                    🎲 Shuffle
                  </button>
                </div>
                <p className="text-stone-400 text-sm mb-4">
                  Professionally crafted. Absolutely brutal. Zero mercy.
                </p>
                <div className="bg-stone-950 rounded-lg p-4 text-sm text-stone-400 max-h-48 overflow-y-auto border border-stone-800">
                  <pre className="whitespace-pre-wrap font-sans">{selectedRoast || "Loading roast..."}</pre>
                </div>
              </div>
            </div>
          </div>

          {/* Option 2: Custom Roast */}
          <div
            onClick={() => setRoastType("custom")}
            className={`cursor-pointer rounded-xl p-6 border-2 transition-all ${
              roastType === "custom"
                ? "border-green-500 bg-stone-900"
                : "border-stone-700 bg-stone-900/50 hover:border-stone-600"
            }`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${
                  roastType === "custom" ? "border-green-500" : "border-stone-600"
                }`}
              >
                {roastType === "custom" && (
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Write Your Own Roast</h3>
                <p className="text-stone-400 text-sm mb-4">
                  Got something personal? Let it out. We&apos;ll deliver it word for word.
                </p>
                {roastType === "custom" && (
                  <textarea
                    value={customRoast}
                    onChange={(e) => setCustomRoast(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Dear Rocky, let me tell you about your golf game..."
                    className="w-full h-48 bg-stone-950 border border-stone-700 rounded-lg p-4 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-green-500 resize-none"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <div className="text-center">
          <button
            onClick={handleCheckout}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-500 disabled:bg-stone-700 disabled:cursor-not-allowed text-white font-bold text-xl px-12 py-4 rounded-xl transition-colors"
          >
            {isLoading ? "Loading..." : "Send the Roast — $1"}
          </button>
          <p className="text-stone-500 text-sm mt-4">
            Rocky will receive the email immediately after payment. No refunds. No mercy.
          </p>
        </div>

        {/* FAQ */}
        <div className="mt-16 border-t border-stone-800 pt-12">
          <h2 className="text-2xl font-bold mb-6">Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Will Rocky know who sent it?</h3>
              <p className="text-stone-400">Nope. Complete anonymity. The email comes from Back Nine Apparel. Your identity stays hidden.</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Is this real?</h3>
              <p className="text-stone-400">100% real. Rocky is a real person. He really can&apos;t play golf. He really will receive this email.</p>
            </div>
            <div>
              <h3 className="font-semibold text-stone-200 mb-2">Can I send multiple roasts?</h3>
              <p className="text-stone-400">Absolutely. Stack &apos;em up. Rocky deserves it.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
