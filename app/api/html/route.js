// app/api/html/route.js
import OpenAI from 'openai';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: 'Please provide a game description' }), 
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{
        role: "system",
        content: `You are a vintage game developer specializing in creating HTML5 canvas-based games with pure JavaScript.
        
        IMPORTANT REQUIREMENTS:
        - Create only black and white retro-style games
        - Provide ONLY the working game code - no explanations, instructions, or descriptions
        - Include all HTML, CSS, and JavaScript in a single file
        - Use only vanilla JavaScript - no external libraries
        - Make the game responsive
        - Keep any necessary game instructions inside the game interface itself
        - Return ONLY the complete HTML,css and javascript code that can be directly rendered
        - Do not include any markdown code blocks or explanatory text
        - Ensure all game elements (canvas, buttons, score displays) are contained within a single root div
        
        The code should start directly with either <!DOCTYPE html> or <div class="game-container"> and contain only the game implementation.`
      }, {
        role: "user",
        content: `Create a vintage black and white game: ${prompt}`
      }],
      temperature: 0.7,
      max_tokens: 1000,
    });

    let gameCode = completion.choices[0].message.content;

    // Remove any markdown code blocks if present
    gameCode = gameCode.replace(/```html/g, '').replace(/```/g, '');

    // Remove any explanatory text before or after the HTML
    gameCode = gameCode.trim();
    if (!gameCode.startsWith('<!DOCTYPE html>') && !gameCode.startsWith('<div')) {
      gameCode = gameCode.substring(gameCode.indexOf('<'));
    }
    if (gameCode.lastIndexOf('>') < gameCode.length - 1) {
      gameCode = gameCode.substring(0, gameCode.lastIndexOf('>') + 1);
    }

    // Add container if not present
    if (!gameCode.includes('<!DOCTYPE html>')) {
      gameCode = `<div class="game-container" style="width:100%;height:100%;display:flex;justify-content:center;align-items:center;">${gameCode}</div>`;
    }

    return new Response(
      JSON.stringify({ code: gameCode }),
      { status: 200 }
    );
  } catch (error) {
    console.error('API Error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate game' }),
      { status: 500 }
    );
  }
}