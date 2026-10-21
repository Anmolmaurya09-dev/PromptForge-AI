import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleHelp,
  Clipboard,
  Coffee,
  Command,
  Copy,
  FileText,
  Image,
  LockKeyhole,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';

type Target = 'ChatGPT' | 'Claude' | 'Midjourney';
type ModalKind = 'support' | 'privacy' | 'terms' | 'disclosure' | 'feedback';
type Preferences = { professional: boolean; concise: boolean; steps: boolean };

const defaultPreferences: Preferences = { professional: true, concise: false, steps: false };

function inferPersona(idea: string) {
  const personaRules: Array<[RegExp, string]> = [
    [/\b(code|coding|software|app|website|api|debug|bug|script|function|typescript|javascript|python|database|program)\b/i, 'a senior software engineer and pragmatic technical architect'],
    [/\b(image|illustration|draw|visual|art|photo|photograph|logo|poster|render|cinematic|scene)\b/i, 'a visual art director with a strong eye for composition and image-making'],
    [/\b(write|writing|draft|email|blog|copy|article|story|script|caption|newsletter|edit)\b/i, 'an expert writer and editor focused on clear, audience-aware communication'],
    [/\b(research|analy[sz]e|compare|evaluate|evidence|sources|study|investigate)\b/i, 'a rigorous research analyst who distinguishes evidence from assumption'],
    [/\b(plan|roadmap|schedule|launch|project|organize|strategy|milestone)\b/i, 'an experienced project strategist who turns goals into practical next steps'],
    [/\b(teach|learn|explain|lesson|tutor|student|curriculum|study guide)\b/i, 'a patient educator who makes complex ideas easy to understand'],
    [/\b(business|sales|marketing|revenue|customer|brand|growth)\b/i, 'a practical business strategist focused on useful, measurable outcomes'],
  ];

  return personaRules.find(([pattern]) => pattern.test(idea))?.[1]
    ?? 'a capable subject-matter expert in the area described by the request';
}

function makeChatGptPrompt(idea: string, preferences: Preferences) {
  const tone = preferences.professional
    ? 'Use a polished, professional, and direct tone.'
    : 'Use a natural, approachable tone suited to the intended audience.';
  const depth = preferences.concise
    ? 'Be concise and prioritize the highest-value information.'
    : 'Give enough detail, context, and practical guidance to make the result immediately useful.';
  const structure = preferences.steps
    ? 'Use an ordered sequence of steps with concise headings.'
    : 'Use Markdown headings and scannable bullets where they improve clarity.';

  return `ROLE / PERSONA
Act as ${inferPersona(idea)}. Bring the expertise relevant to the request without claiming personal credentials or inventing experience.

CONTEXT & BACKGROUND
Treat the user's brief as the source of truth. Preserve its goal, named details, intended audience, and any constraints. Information not supplied is unknown; make only reasonable, clearly labeled assumptions.

USER'S ORIGINAL BRIEF
${idea}

TASK
Fulfill the request directly. If a critical detail is missing, ask one focused clarifying question; otherwise proceed using the stated brief.

CONSTRAINTS & RULES
- ${tone}
- ${depth}
- Respect the audience, medium, and purpose implied by the brief.
- Avoid filler, repetition, unsupported claims, and unnecessary jargon.
- Do not add facts, requirements, or scope that the user did not provide.

DESIRED OUTPUT FORMAT
- ${structure}
- Lead with the useful answer rather than a description of your process.
- Include examples, a checklist, or a short summary only when they make the result more actionable.`;
}

function escapeXml(value: string) {
  return value.replace(/[<>&"']/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    '"': '&quot;',
    "'": '&apos;',
  })[character] ?? character);
}

function makeClaudePrompt(idea: string, preferences: Preferences) {
  const tone = preferences.professional
    ? 'Maintain a professional, deeply analytical, and highly articulate writing tone.'
    : 'Maintain a thoughtful, approachable, deeply analytical, and highly articulate writing tone.';
  const depth = preferences.concise
    ? 'Keep the final answer focused and economical while preserving the essential reasoning and nuance.'
    : 'Explore relevant nuance and implications, then make the final answer thorough without repeating points.';
  const format = preferences.steps
    ? 'Organize the final answer as a clear sequence of steps, with headings where useful.'
    : 'Use precise headings and well-structured paragraphs; use bullets when they improve readability.';

  return `<system_instructions>
You are ${inferPersona(idea)}. Follow the user's request carefully, reason with depth, and write with clarity, nuance, and precision.
Before giving the final answer, think through the task step by step using <thinking>...</thinking> tags. Then present the answer using <final_answer>...</final_answer> tags.
- ${tone}
- ${depth}
- Distinguish supplied facts from assumptions; do not fabricate details or sources.
- Avoid filler, repetition, and unsupported claims.
</system_instructions>

<context>
<user_request>${escapeXml(idea)}</user_request>
Treat the request as the authoritative brief. Preserve its goal and constraints; infer only what is necessary to complete it.
</context>

<task>
Fulfill the user's request directly. If a critical ambiguity prevents a reliable answer, ask one focused clarifying question; otherwise state any necessary assumption briefly and proceed.
</task>

<response_preferences>
${format}
Make the result useful, complete, and appropriately tailored to the request.
</response_preferences>`;
}

function makeMidjourneyPrompt(idea: string, preferences: Preferences) {
  const scene = idea.replace(
    /^(?:please\s+)?(?:create|generate|make|draw|illustrate|show)\s+(?:me\s+)?(?:an?\s+)?(?:image|picture|photo|photograph|illustration|render|artwork|scene)\s+(?:of|showing|depicting)\s+/i,
    '',
  );
  const artDirection = preferences.professional
    ? 'refined cinematic art direction and a cohesive color palette'
    : 'expressive visual storytelling and an imaginative color palette';
  const detail = preferences.concise
    ? 'a clean focal point, crisp subject detail, and uncluttered framing'
    : 'layered environmental detail, tactile textures, and atmospheric depth';

  return `/imagine prompt: A cinematic visual interpretation of ${scene}, ${artDirection}, ${detail}, strong focal point, balanced widescreen composition, dramatic but natural volumetric lighting, photorealistic, 8k resolution, hyper-detailed, shot on 35mm lens, realistic textures, subtle film grain --ar 16:9 --v 6.0`;
}

function makePrompt(raw: string, target: Target, preferences: Preferences) {
  const idea = raw.trim().replace(/\s+/g, ' ');
  if (target === 'Midjourney') return makeMidjourneyPrompt(idea, preferences);
  if (target === 'Claude') return makeClaudePrompt(idea, preferences);
  return makeChatGptPrompt(idea, preferences);
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }
  const field = document.createElement('textarea');
  field.value = value;
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  const succeeded = document.execCommand('copy');
  field.remove();
  if (!succeeded) throw new Error('Clipboard unavailable');
}

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [target, setTarget] = useState<Target>('ChatGPT');
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [toast, setToast] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackCopied, setFeedbackCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = (message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 2800);
  };

  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModal(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      previous?.focus();
    };
  }, [modal]);

  const enhance = () => {
    if (!input.trim()) {
      announce('Add a rough idea first, then enhance it.');
      inputRef.current?.focus();
      return;
    }
    setOutput(makePrompt(input, target, preferences));
    announce(`Prompt shaped for ${target}.`);
  };

  const clearWorkspace = () => {
    setInput('');
    setOutput('');
    setFeedback('');
    setFeedbackCopied(false);
    announce('Workspace cleared.');
    inputRef.current?.focus();
  };

  const copyOutput = async () => {
    if (!output) return;
    try {
      await copyText(output);
      announce('Enhanced prompt copied to clipboard.');
    } catch {
      announce('Clipboard access was unavailable. Select and copy the prompt instead.');
    }
  };

  const toggle = (key: keyof Preferences) =>
    setPreferences((current) => ({ ...current, [key]: !current[key] }));

  const submitFeedback = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedback.trim()) {
      announce('Write a little feedback before copying.');
      return;
    }
    try {
      await copyText(feedback.trim());
      setFeedbackCopied(true);
      announce('Feedback copied locally. It was not sent.');
    } catch {
      announce('Clipboard access was unavailable. Your feedback was not sent.');
    }
  };

  const openFooterModal = (kind: ModalKind) => {
    setModal(kind);
    if (kind === 'feedback') setFeedbackCopied(false);
  };

  const modalContent = () => {
    switch (modal) {
      case 'support':
        return {
          kicker: 'A little extra room',
          title: 'Keep the work flowing',
          body: 'Unlock Advanced Frameworks for this session by supporting the developer! Expert Mode and Brief Rationale are premium options. If PromptForge has helped you get unstuck, a coffee helps support future improvements.',
          action: <a className="modal-primary" href="https://www.buymeacoffee.com/am_flowstudio" target="_blank" rel="noopener noreferrer" data-testid="link-support-coffee"><Coffee /> Buy me a coffee</a>,
        };
      case 'privacy':
        return {
          kicker: 'Privacy policy',
          title: 'Your ideas stay yours.',
          body: 'PromptForge runs entirely in this browser. The prompt you type and the enhanced result are processed locally on your device; prompt data remains local in this browser and is not stored or sent to external servers. Clearing the workspace removes the current text from this page. No account is required.',
        };
      case 'terms':
        return {
          kicker: 'Terms of service',
          title: 'A simple tool, used thoughtfully.',
          body: 'PromptForge is provided as a client-side creative utility. You are responsible for reviewing and using the prompts and outputs it produces. The enhancement is a local formatting aid, not a guarantee of results from any third-party model. Use the tool lawfully and avoid entering information you do not have permission to use.',
        };
      case 'disclosure':
        return {
          kicker: 'AI disclosure',
          title: 'No AI service is called here.',
          body: 'PromptForge does not connect to ChatGPT, Claude, Midjourney, or any other model. It locally rearranges your idea into a structured prompt template in this browser. Prompt data remains local in this browser and is not stored or sent to external servers. You choose whether to copy the result into another service.',
        };
      case 'feedback':
        return {
          kicker: 'Feedback',
          title: 'Help shape the next draft.',
          body: 'Tell us what would make PromptForge more useful. Nothing is submitted: when you choose copy feedback, your text is copied to your clipboard so you can send it yourself.',
        };
      default:
        return null;
    }
  };

  const content = modalContent();

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/" data-testid="link-home" aria-label="PromptForge AI home">
          <span className="brand-mark"><WandSparkles size={18} strokeWidth={1.8} /></span>
          <span>PromptForge<span style={{ color: '#8d7bff' }}> AI</span></span>
        </a>
        <div className="top-note" data-testid="status-local-processing"><span className="local-dot" /> YOUR PROMPTS STAY ON THIS DEVICE</div>
      </header>

      <main className="page">
        <section className="intro" aria-labelledby="page-title">
          <div className="eyebrow"><span className="eyebrow-line" /> THE PROMPT WORKSHOP <span className="eyebrow-line" /></div>
          <h1 id="page-title">A better prompt<br />starts with a thought.</h1>
          <p>Bring the rough idea. Leave with a prompt that knows where it’s going.</p>
        </section>

        <section className="workspace-layout" aria-label="Prompt optimizer">
          <div className="workspace">
            <section className="editor-panel" aria-labelledby="input-title">
              <div className="panel-head">
                <div className="panel-title" id="input-title"><span className="step-index">01</span> Your starting point</div>
                <span className="tiny-label">ROUGH IS RIGHT</span>
              </div>
              <div className="editor-body">
                  <label className="field-label" htmlFor="raw-prompt">1. Paste your raw, basic prompt here <span className="char-count" data-testid="text-input-count">{input.length} / 2,000</span></label>
                <textarea
                  ref={inputRef}
                  id="raw-prompt"
                  className="prompt-input"
                  data-testid="input-raw-prompt"
                  maxLength={2000}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={'e.g. Help me write a launch email for my small ceramics shop. Make it feel warm, not salesy.'}
                  aria-describedby="input-hint"
                />
                <span id="input-hint" className="tiny-label" style={{ marginTop: 7 }}>A sentence fragment is plenty.</span>

                <div className="section-label"><Command size={14} /> Shape it for <span className="tiny-label">PICK A DESTINATION</span></div>
                <div className="target-grid" role="group" aria-label="Choose a prompt destination">
                  {(['ChatGPT', 'Claude', 'Midjourney'] as Target[]).map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={`target-option${target === name ? ' selected' : ''}`}
                      onClick={() => setTarget(name)}
                      aria-pressed={target === name}
                      data-testid={`button-target-${name.toLowerCase()}`}
                    >
                      {name === 'Midjourney' ? <Image /> : <MessageSquare />}
                      Optimize for {name}
                    </button>
                  ))}
                </div>

                <div className="prefs-heading">A few finishing touches <span>OPTIONAL</span></div>
                <ToggleRow label="Professional tone" icon={<FileText />} checked={preferences.professional} onChange={() => toggle('professional')} testId="toggle-professional-tone" />
                <ToggleRow label="Keep it concise" icon={<ArrowDownToLine />} checked={preferences.concise} onChange={() => toggle('concise')} testId="toggle-concise" />
                <ToggleRow label="Step-by-step structure" icon={<ChevronDown />} checked={preferences.steps} onChange={() => toggle('steps')} testId="toggle-step-by-step" />
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0ebe3' }}>
                  <button className="locked-control" type="button" onClick={() => setModal('support')} data-testid="button-expert-mode-locked"><LockKeyhole /> Expert Mode</button>
                  <button className="locked-control" type="button" onClick={() => setModal('support')} data-testid="button-brief-rationale-locked"><LockKeyhole /> Brief Rationale</button>
                </div>

                <div className="editor-actions">
                  <button className="enhance-button" type="button" onClick={enhance} disabled={!input.trim()} data-testid="button-enhance-prompt">
                    <Sparkles /> Enhance Prompt
                  </button>
                </div>
              </div>
            </section>

            <section className="result-panel" aria-labelledby="result-title">
              <div className="panel-head">
                <div className="panel-title" id="result-title"><span className="step-index">02</span> Ready for its next step</div>
                <div className="result-tools">
                  <span className="result-status" data-testid="status-output-state"><span className={`status-dot${output ? ' ready' : ''}`} />{output ? 'READY' : 'AWAITING IDEA'}</span>
                </div>
              </div>
              <div className="result-body">
                <div className={`output-box${output ? ' has-output' : ''}`}>
                  <textarea
                    className="output-content"
                    data-testid="output-enhanced-prompt"
                    readOnly
                    value={output}
                    aria-label="Enhanced prompt, read only"
                    placeholder=""
                  />
                  {!output && <div className="empty-output" data-testid="status-empty-output"><div className="empty-icon"><Sparkles /></div><strong>Your polished prompt lands here.</strong><span>Shape your idea on the left, then let’s give it a little direction.</span></div>}
                </div>
                <div className="output-foot"><span>{output ? `${output.length} CHARACTERS` : 'NOTHING GENERATED YET'}</span><span>{output ? `FOR ${target.toUpperCase()}` : 'LOCAL, BY DESIGN'}</span></div>
                <div className="output-actions">
                  <button className="copy-button" type="button" onClick={copyOutput} disabled={!output} data-testid="button-copy-prompt"><Copy /> Copy to Clipboard</button>
                  <button className="clear-button" type="button" onClick={clearWorkspace} data-testid="button-clear-workspace"><RotateCcw /> Clear Workspace</button>
                </div>
                <div className="privacy-note" data-testid="text-local-privacy-note"><ShieldCheck /> Everything happens locally in this browser. Your prompt is never stored or sent to an external server.</div>
              </div>
            </section>
          </div>

          <aside className="ad-rail" aria-label="Advertisement">
            <div className="ad-placeholder" data-testid="ad-space-right">
              <span className="ad-tag">ADVERTISEMENT</span>
              <span className="ad-mark"><CircleHelp /></span>
              <strong>Advertisement Space</strong>
              <p>A quiet spot for something useful.</p>
            </div>
          </aside>
        </section>
        <div className="banner-ad" data-testid="ad-space-bottom" aria-label="Advertisement space"><span className="ad-tag">ADVERTISEMENT</span><span className="banner-ad-label">Advertisement Space</span></div>
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-copy" data-testid="text-footer-copyright">© 2025 PromptForge AI <span style={{ margin: '0 7px' }}>·</span> A small tool for big ideas.</div>
          <nav className="footer-links" aria-label="Footer">
            <button type="button" onClick={() => openFooterModal('privacy')} data-testid="link-privacy">Privacy Policy</button>
            <button type="button" onClick={() => openFooterModal('terms')} data-testid="link-terms">Terms of Service</button>
            <a href="https://docu-flowai.netlify.app" target="_blank" rel="noopener noreferrer" data-testid="link-docu-flowai">Try docu_flowai</a>
            <button type="button" onClick={() => openFooterModal('disclosure')} data-testid="link-ai-disclosure">AI Disclosure</button>
            <button type="button" onClick={() => openFooterModal('feedback')} data-testid="link-feedback">Feedback</button>
          </nav>
        </div>
      </footer>

      <a className="coffee-float" href="https://www.buymeacoffee.com/am_flowstudio" target="_blank" rel="noopener noreferrer" data-testid="link-buy-me-a-coffee"><Coffee /> Buy me a coffee</a>
      {toast && <div className="toast-message" role="status" aria-live="polite" data-testid="status-toast">{toast}</div>}

      {modal && content && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }} data-testid="modal-backdrop">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description" tabIndex={-1} ref={dialogRef} data-testid={`modal-${modal}`}>
            <button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Close dialog" data-testid="button-modal-close"><X /></button>
            <div className="modal-kicker">{content.kicker}</div>
            <h2 className="modal-title" id="modal-title">{content.title}</h2>
            <div className="modal-copy" id="modal-description">{content.body}</div>
            {modal === 'feedback' && (
              <form onSubmit={submitFeedback} data-testid="form-feedback">
                <label className="field-label" htmlFor="feedback-text" style={{ marginTop: 16 }}>Your note</label>
                <textarea id="feedback-text" className="feedback-area" data-testid="input-feedback" value={feedback} onChange={(event) => { setFeedback(event.target.value); setFeedbackCopied(false); }} placeholder="What would make this more useful?" />
                <div className="feedback-actions">
                  <button className="secondary-button" type="button" onClick={() => setModal(null)} data-testid="button-feedback-cancel">Close</button>
                  <button className="modal-primary" type="submit" data-testid="button-copy-feedback">{feedbackCopied ? <><Check /> Copied</> : <><Clipboard /> Copy feedback</>}</button>
                </div>
                {feedbackCopied && <div className="modal-note" role="status" data-testid="status-feedback-copied"><ShieldCheck /> Copied to your clipboard. Nothing was sent; paste it wherever you choose.</div>}
              </form>
            )}
            {modal === 'support' && <div style={{ marginTop: 20 }}>{content.action}</div>}
            {modal !== 'feedback' && modal !== 'support' && <div className="modal-note"><ShieldCheck /> No account. No prompt uploads. No hidden processing.</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, icon, checked, onChange, testId }: { label: string; icon: ReactNode; checked: boolean; onChange: () => void; testId: string }) {
  return (
    <div className="toggle-row">
      <span className="toggle-info">{icon}{label}</span>
      <button type="button" className="switch" role="switch" aria-checked={checked} aria-label={label} onClick={onChange} data-testid={testId}><span className="switch-knob" /></button>
    </div>
  );
}

export default App;
