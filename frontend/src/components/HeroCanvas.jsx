import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function HeroCanvas() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return
    const width = mount.clientWidth
    const height = mount.clientHeight

    // Scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100)
    camera.position.z = 5.5

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    // ── Main sphere wireframe ──
    const sphereGeo = new THREE.IcosahedronGeometry(2, 4)
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xFF8C61,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
    })
    const sphereMesh = new THREE.Mesh(sphereGeo, wireMat)
    scene.add(sphereMesh)

    // ── Points on sphere surface ──
    const dotGeo = new THREE.IcosahedronGeometry(2, 4)
    const dotMat = new THREE.PointsMaterial({
      color: 0xFF8C61,
      size: 0.045,
      transparent: true,
      opacity: 0.9,
    })
    const dots = new THREE.Points(dotGeo, dotMat)
    scene.add(dots)

    // ── Inner glowing core ──
    const coreGeo = new THREE.SphereGeometry(0.5, 32, 32)
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xFF8C61,
      transparent: true,
      opacity: 0.12,
    })
    scene.add(new THREE.Mesh(coreGeo, coreMat))

    // ── Orbiting ring 1 ──
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(2.9, 0.012, 16, 256),
      new THREE.MeshBasicMaterial({ color: 0xE8571A, transparent: true, opacity: 0.45 })
    )
    ring1.rotation.x = Math.PI / 3
    scene.add(ring1)

    // ── Orbiting ring 2 ──
    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(2.55, 0.008, 16, 256),
      new THREE.MeshBasicMaterial({ color: 0xFF8C61, transparent: true, opacity: 0.28 })
    )
    ring2.rotation.x = -Math.PI / 5
    ring2.rotation.y = Math.PI / 6
    scene.add(ring2)

    // ── Orbiting satellite dots on ring 1 ──
    const satCount = 5
    const satellites = []
    for (let i = 0; i < satCount; i++) {
      const geo = new THREE.SphereGeometry(0.06, 8, 8)
      const mat = new THREE.MeshBasicMaterial({ color: 0xE8571A })
      const sat = new THREE.Mesh(geo, mat)
      satellites.push({ mesh: sat, angle: (i / satCount) * Math.PI * 2, radius: 2.9, tilt: Math.PI / 3 })
      scene.add(sat)
    }

    // ── Background floating particles ──
    const pCount = 300
    const pPositions = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPositions[i * 3]     = (Math.random() - 0.5) * 18
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 18
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 12
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3))
    const pMat = new THREE.PointsMaterial({
      color: 0xFFAB76,
      size: 0.025,
      transparent: true,
      opacity: 0.55,
    })
    const bgParticles = new THREE.Points(pGeo, pMat)
    scene.add(bgParticles)

    // ── Mouse parallax ──
    let targetX = 0, targetY = 0
    const onMouseMove = (e) => {
      targetX = (e.clientX / window.innerWidth  - 0.5) * 0.6
      targetY = (e.clientY / window.innerHeight - 0.5) * 0.4
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── Animation loop ──
    const clock = new THREE.Clock()
    let animId

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      sphereMesh.rotation.y = t * 0.12
      sphereMesh.rotation.x = t * 0.07
      dots.rotation.y = t * 0.12
      dots.rotation.x = t * 0.07

      ring1.rotation.z = t * 0.22
      ring2.rotation.z = -t * 0.16

      // Update satellite positions along ring 1
      satellites.forEach((s, i) => {
        const a = s.angle + t * 0.4 + (i * Math.PI * 2) / satCount
        s.mesh.position.x = Math.cos(a) * s.radius
        s.mesh.position.y = Math.sin(a) * s.radius * Math.sin(s.tilt)
        s.mesh.position.z = Math.sin(a) * s.radius * Math.cos(s.tilt)
      })

      bgParticles.rotation.y = t * 0.018

      // Smooth camera follow mouse
      camera.position.x += (targetX - camera.position.x) * 0.04
      camera.position.y += (-targetY - camera.position.y) * 0.04
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    // Visitors who ask for reduced motion get a single still frame of the same scene.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Stop drawing while the hero is scrolled out of view; resume where it left off.
    let visible = true
    let pausedAt = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (reduceMotion) return
      if (entry.isIntersecting && !visible) { visible = true; clock.start(); clock.elapsedTime = pausedAt; animate() }
      else if (!entry.isIntersecting && visible) { visible = false; pausedAt = clock.getElapsedTime(); cancelAnimationFrame(animId) }
    })
    observer.observe(mount)

    if (reduceMotion) renderer.render(scene, camera)
    else animate()

    // ── Resize ──
    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      if (reduceMotion) renderer.render(scene, camera)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      observer.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
