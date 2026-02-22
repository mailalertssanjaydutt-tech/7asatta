import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section">
      <div className="containers">
        <div className="wrapper">
          <div className="text-center">
            <h2>Frequently Asked Questions</h2>
          </div>

          <div className="faq-list">
            {/* FAQ 1 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 0 ? "active" : ""}`}
                onClick={() => toggleFAQ(0)}
              >
                <span className="sr">01.</span> What is Satta King and who created it?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 0 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  Satta King is the name of a kind of lottery game, and which comes under "Gambling. The game is actually known as Satta Matka — a form of gambling where a number is chosen from a pot. State-banned, it developed haphazardly over decades into Satta, a lottery-style game where players attempt to guess the correct numbers. Delhi, Disawar, Gali, and other regional markets are divided by this patchwork, each with its own seasons and histories, some of which can be explained in terms of mental banking.
                </div>
              </div>
            </div>

            {/* FAQ 2 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 1 ? "active" : ""}`}
                onClick={() => toggleFAQ(1)}
              >
                <span className="sr">02.</span> In the Satta King game, who is A7 Satta?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 1 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  One of the greatest websites for real Satta King results, records charts, online wagers, and secure Satta betting locations is A7 Satta. It offers services and assistance to players, including user data protection, new draw alerts, safe gaming guidelines, and real-time results, among other things. Both novice and seasoned gamblers looking for a website they can rely on to provide openness are drawn to its strong reputation.

                </div>
              </div>
            </div>

            {/* FAQ 3 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 2 ? "active" : ""}`}
                onClick={() => toggleFAQ(2)}
              >
                <span className="sr">03.</span> How can I use A7 Satta to play the Satta King?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 2 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
In order to participate, a player must first create an account on the A7 Satta app or website, select a market, pick a number between 00 and 99, and then place bets on a variety of bet kinds (including Single, Jodi, and Panna). if the chosen sum is the same as what was declared on those markets and lands following the draw.
                </div>
              </div>
            </div>

            {/* FAQ 4 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 3 ? "active" : ""}`}
                onClick={() => toggleFAQ(3)}
              >
                <span className="sr">04.</span> What are Satta King's primary payment rates?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 3 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
					Common types of bets include:
<br/>
				
                Ank (Single): Place a wager on a single digit from 0 to 9.
 <br/>
				Jodi (Pair): A bet with two digits high or low (00-99) is called a pair, and it is even most frequently employed for a favourable reward.
<br/>
				Panna (Treble): Place a wager on three-digit multiple figures.
<br/>
				Although there are pay tables and side bets, I've only included the most well-liked ones here. Max payouts could go from 90 to 960 times the wager per market and prediction.
                </div>
              </div>
            </div>

            {/* FAQ 5 */}
            <div className="container01">
              <div
                className={`question ${activeIndex === 4 ? "active" : ""}`}
                onClick={() => toggleFAQ(4)}
              >
                <span className="sr">05.</span> How to track Satta result as a player of Satta King? How one can be updated with any news related to Satta king bazaar?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 4 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  A7 Satta instantly sponsored push alerts and posted the official draw results on their website. Every market will have its own online results page and timestamp. In order to prevent being duped, gamblers should choose news from reliable sources, even though they can utilise algorithms and historical results to choose their wager.

                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 5 ? "active" : ""}`}
                onClick={() => toggleFAQ(5)}
              >
                <span className="sr">06.</span> What are the regulations of Satta King India?
              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 5 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  It is considered illegal and a crime in states that have banished the lottery. If the betting is on an organisation or a person despite being aware of their nature, chances of getting fined are ruled out as it would rather be considered illegal. Although the act of playing Satta online is considered illegal in India, according to some arbitrary law, individuals participating in the game are not subject to legal consequences; however, users should consult their local laws and regulations on Satta gambling or betting since Satta may be banned there.


                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 6 ? "active" : ""}`}
                onClick={() => toggleFAQ(6)}
              >
                <span className="sr">07.</span> What risks come with playing Satta King offline versus online?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 6 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">
                  Key risks include:<br/>
					Loss of money: The house has a good chance.<br/>
					Addiction: Quick games with big payouts have the potential to exacerbate gambling addiction.<br/>
Liability: It is against the law to gamble indefinitely.<br/>
Cybersecurity or fake: Other websites show up on scam websites, and they don't guarantee the security of the data or the funds. When playing at locations like A7 Satta, people need to have faith in their safety and privacy.
                </div>
              </div>
            </div>

            <div className="container01">
              <div
                className={`question ${activeIndex === 7 ? "active" : ""}`}
                onClick={() => toggleFAQ(7)}
              >
                <span className="sr">08.</span> What are some strategies for winning Satta King?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 7 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">                  
Although no method is infallible, players attempt to predict patterns of the numbers that will be drawn by using historical charts and trends in previous outcomes tracking that A7 Satta of the "Secret Powerball Technique" gives. These methods don't change the odds, but they can make your betting more enjoyable. Leading suppliers emphasise avoiding losses and gambling for enjoyment over profit, two important pointers that Gasportal provides for those who place ethical bets.
                </div>
              </div>
            </div>
			
			<div className="container01">
              <div
                className={`question ${activeIndex === 8 ? "active" : ""}`}
                onClick={() => toggleFAQ(8)}
              >
                <span className="sr">09.</span> How A7 Satta Ensure The User Safety and Ethical Gaming?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 8 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">                  
A7 Satta focus on protecting the privacy of our users by enabling the encryption where it is needed to keep their personal information confidential and while verifying them in a more concealed manner. Such advice as establishing limits, identifying signs of risk, taking breaks and seeking assistance if a gambling problem is suspected are commonly provided on the site. They also can provide legal risk education and, if needed, point people to armed forces support services.

                </div>
              </div>
            </div>
			
			<div className="container01">
              <div
                className={`question ${activeIndex === 9 ? "active" : ""}`}
                onClick={() => toggleFAQ(9)}
              >
                <span className="sr">10.</span> How different is A7 Satta compared to other business partners like A1 Satta, A2 Satta, A3 Satta, A4 Satta,,A7 satt etc and B7 satt and Lucky satt?

              </div>
              <div
                className="answercont"
                style={{
                  maxHeight: activeIndex === 9 ? "500px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="answer">                  
A1 Satta, A2 Satta, A3 Satta, A4 Satta, A7 Satta, A8 Satta Now since Lucky Satta are mentioned in the betting model their verifications results analysis and player support is shared with you by them. Together they offer a variety of markets, and help to make draw results more transparent, and promote responsible betting behavior. Tipping together, they create cross-platform trust that creates new opportunities and rivals.


                </div>
              </div>
            </div>


            {/* Add more FAQs below as needed */}
          </div>
        </div>
      </div>
    </section>
  );
}


