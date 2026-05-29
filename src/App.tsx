import ZipEncoder from './components/ZipEncoder';
import ZipUploader from './components/ZipUploader';

function App() {
  return (
    <>
      <ZipEncoder />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pb-16 -mt-4">
        <ZipUploader />
      </div>
    </>
  );
}

export default App;